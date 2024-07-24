import Database from 'better-sqlite3'
import { Swiss } from 'tournament-pairings'

type playerObject = {
  firstname: string
  lastname: string
  rating: number
}

type swissPlayerObject = {
  id: string
  score: number
  rating: number
}

export default class Manager {
  db: Database
  name: string
  format: string

  constructor(db: Database, name: string, format: string) {
    this.db = db
    this.name = name
    this.format = format
  }

  createTournament(name: string, roundNums: number): void {
    const createTourneyListQuery = `CREATE TABLE IF NOT EXISTS TourneyList(name TEXT NOT NULL, totalRounds INT NOT NULL, roundsComplete INT NOT NULL, roundInProgress INT NOT NULL)`
    this.db.exec(createTourneyListQuery)

    // add tournament to tourney list
    const insertTourneyQuery =
      'INSERT INTO TourneyList (name, totalRounds, roundsComplete, roundInProgress) VALUES (?, ?, ?, ?)'
    this.db.prepare(insertTourneyQuery).run(name, roundNums, 0, 0)

    // create table for tournament to store player information
    const createPlayersTableQuery = `CREATE TABLE IF NOT EXISTS ${name}_players(firstname TEXT NOT NULL, lastname TEXT NOT NULL, rating INT)`
    this.db.exec(createPlayersTableQuery)
  }

  loadTournaments(): object[] {
    const createTourneyListQuery = `CREATE TABLE IF NOT EXISTS TourneyList(name TEXT NOT NULL, totalRounds INT NOT NULL, roundsComplete INT NOT NULL, roundInProgress INT NOT NULL)`
    this.db.exec(createTourneyListQuery)
    // fetch rows from table and return it as list of string
    const sql = `SELECT * FROM TourneyList`
    const names = this.db.prepare(sql).all()
    return names
  }

  getPlayers(tournamentName: string): object[] {
    const sql = `SELECT * FROM ${tournamentName}_players`
    const names = this.db.prepare(sql).all()
    return names
  }

  addPlayer(playerInfo: object, tournamentName: string): void {
    const { firstName, lastName, rating } = playerInfo
    const sql = `INSERT INTO ${tournamentName}_players (firstname, lastname, rating) VALUES (?, ?, ?)`
    this.db.prepare(sql).run(firstName, lastName, rating)
  }

  deletePlayer(playerInfo: object, tournamentName: string): void {
    const { firstName, lastName, rating } = playerInfo[0]
    const sql = `DELETE FROM ${tournamentName}_players WHERE firstname = ? AND lastname = ? AND rating = ?`
    this.db.prepare(sql).run(firstName, lastName, rating)
  }

  createStandings(tournamentName: string): void {
    // create standings table
    const query = `CREATE TABLE IF NOT EXISTS ${tournamentName}_standings(firstname TEXT NOT NULL, lastname TEXT NOT NULL, rating INT, score FLOAT)`
    this.db.exec(query)

    // fill table with players and score of zero
    const sql = `SELECT * FROM ${tournamentName}_players`
    const players = this.db.prepare(sql).all()

    players.forEach((player: playerObject) => {
      const { firstname, lastname, rating } = player
      const fill_query = `INSERT INTO ${tournamentName}_standings (firstname, lastname, rating, score) VALUES (?, ?, ?, ?)`
      this.db.prepare(fill_query).run(firstname, lastname, rating, 0)
    })
  }

  getCurrentStandings(tournamentName: string): object[] {
    const sql = `SELECT * FROM ${tournamentName}_standings`
    const playerStandings = this.db.prepare(sql).all()
    return playerStandings
  }

  checkStandings(tournamentName: string): boolean {
    const query = `SELECT name FROM sqlite_master WHERE type='table' AND lower(name)=lower(?)`
    const result = this.db.prepare(query).get(`${tournamentName}_standings`)
    return result !== undefined
  }

  checkRoundInProgress(tournamentName: string): boolean {
    const query = `SELECT name FROM TourneyList WHERE name=? AND roundInProgress=?`
    const result = this.db.prepare(query).get(tournamentName, 1)
    console.log(`roundInProgress value: ${result}`)
    return result !== undefined
  }

  getCurrentRound(tournamentName: string): number {
    // retrive from tourneylist table
    const currentRoundQuery = 'SELECT roundsComplete FROM TourneyList WHERE name = ?'
    const roundNumObj = this.db.prepare(currentRoundQuery).get(tournamentName)
    return roundNumObj.roundsComplete + 1
  }

  generatePairings(tournamentName: string): void {
    // set roundInProgress for tournamentName to 1
    const setRoundInProgressQuery = `UPDATE TourneyList SET roundInProgress=? WHERE name=?`
    this.db.prepare(setRoundInProgressQuery).run(1, tournamentName)
    console.log(`set ${tournamentName}'s roundInProgress to 1`)

    const sql = `SELECT * FROM ${tournamentName}_standings`
    const playerStandings = this.db.prepare(sql).all()
    // call tournament-pairing api to generate pairings
    const playerObjects: swissPlayerObject[] = []

    playerStandings.map((player) => {
      playerObjects.push({
        id: `${player.firstname} ${player.lastname}`,
        score: player.score,
        rating: player.rating
      })
    })

    const currentRound = this.getCurrentRound(tournamentName)
    // returns an array of matches
    const matches = Swiss(playerObjects, currentRound)

    // create table to store pairing round
    const createPairingTableQuery = `CREATE TABLE IF NOT EXISTS ${tournamentName}_round_${currentRound}(match_id INT NOT NULL, player1 TEXT NOT NULL, result TEXT NOT NULL, player2 TEXT NOT NULL)`
    this.db.exec(createPairingTableQuery)

    // populate table
    matches.forEach((matchPair) => {
      const { match, player1, player2 } = matchPair
      const fill_query = `INSERT INTO ${tournamentName}_round_${currentRound} (match_id, player1, result, player2) VALUES (?, ?, ?, ?)`
      this.db.prepare(fill_query).run(match, player1, 'x-x', player2)
    })
    return
  }

  getPairings(tournamentName): object[] {
    const currentRound = this.getCurrentRound(tournamentName)

    // check if current round has been generated; return empty list other wise
    const query = `SELECT name FROM sqlite_master WHERE type='table' AND lower(name)=lower(?)`
    const result = this.db.prepare(query).get(`${tournamentName}_round_${currentRound}`)
    if (result === undefined) {
      // display message to user saying round has been generated
      // display previous rounds in a non editable way
      return []
    }

    const sql = `SELECT * FROM ${tournamentName}_round_${currentRound}`
    const pairings = this.db.prepare(sql).all()
    const matches: object[] = []
    pairings.map((pair) =>
      matches.push({
        match: pair.match_id,
        player1: pair.player1,
        result: pair.result,
        player2: pair.player2
      })
    )

    return matches
  }

  updateResult(tournamentName, match_id, result): void {
    // update result for a match in current round
    const currentRound = this.getCurrentRound(tournamentName)
    const updateResultQuery = `UPDATE ${tournamentName}_round_${currentRound} SET result=? WHERE match_id=?`
    this.db.prepare(updateResultQuery).run(result, match_id)
    return
  }

  completeRound(tournamentName): void {
    console.log(`Completing round for ${tournamentName}`)

    // get results from current_round and update score for standings
    const matches = this.getPairings(tournamentName)
    const drawQuery = `UPDATE ${tournamentName}_standings SET score = score + 0.5 WHERE firstname=? AND lastname=?`
    const winQuery = `UPDATE ${tournamentName}_standings SET score = score + 1 WHERE firstname=? AND lastname=?`
    matches.map((pair) => {
      const [p1_firstname, p1_lastname] = pair.player1.split(' ')
      const [p2_firstname, p2_lastname] = pair.player2.split(' ')

      if (pair.result == '1/2-1/2') {
        this.db.prepare(drawQuery).run(p1_firstname, p1_lastname)
        this.db.prepare(drawQuery).run(p2_firstname, p2_lastname)
      } else if (pair.result == '1-0') {
        this.db.prepare(winQuery).run(p1_firstname, p1_lastname)
      } else if (pair.result == '0-1') {
        this.db.prepare(winQuery).run(p2_firstname, p2_lastname)
      }
    })

    // * CHANGE is round in progress back to 0
    const setRoundInProgressQuery = `UPDATE TourneyList SET roundInProgress=? WHERE name=?`
    this.db.prepare(setRoundInProgressQuery).run(0, tournamentName)
    console.log(`reset ${tournamentName}'s roundInProgress to 0`)

    // update round if not final round
    // if final - complete tournament (display final standings)
    // update roundsComplete in TourneyList
    const incrementRoundsCompleteQuery = `UPDATE TourneyList SET roundsComplete = roundsComplete + 1 WHERE name=?`
    this.db.prepare(incrementRoundsCompleteQuery).run(tournamentName)
    console.log(`reset ${tournamentName}'s roundInProgress to 0`)

    return
  }
}
