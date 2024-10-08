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
  receivedBye: boolean
  colors?: Array<'w' | 'b'>
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
    this.createTourneyListTable()

    // add tournament to tourney list
    const insertTourneyQuery =
      'INSERT INTO TourneyList (name, totalRounds, roundsComplete, roundInProgress) VALUES (?, ?, ?, ?)'
    this.db.prepare(insertTourneyQuery).run(name, roundNums, 0, 0)

    // create table for tournament to store player information
    const createPlayersTableQuery = `CREATE TABLE IF NOT EXISTS ${name}_players(firstname TEXT NOT NULL, lastname TEXT NOT NULL, rating INT)`
    this.db.exec(createPlayersTableQuery)
  }

  deleteTournament(name: string): void {
    // create table for tournament to store player information
    const retrieveTablesToDropQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE ?`
    const tablesToDrop = this.db.prepare(retrieveTablesToDropQuery).all(name + '%')

    tablesToDrop.forEach((tableName) => {
      const dropTableQuery = `DROP TABLE IF EXISTS ${tableName.name}`
      this.db.prepare(dropTableQuery).run()
    })

    // delete from tourneyList
    const deleteTourneyFromTable = `DELETE FROM TourneyList WHERE name=?`
    this.db.prepare(deleteTourneyFromTable).run(name)
  }

  createTourneyListTable(): void {
    const createTourneyListQuery = `CREATE TABLE IF NOT EXISTS TourneyList(name TEXT NOT NULL, totalRounds INT NOT NULL, roundsComplete INT NOT NULL, roundInProgress INT NOT NULL)`
    this.db.exec(createTourneyListQuery)
  }

  loadTournaments(): object[] {
    this.createTourneyListTable()
    // fetch rows from table and return it as list of string
    const sql = `SELECT * FROM TourneyList`
    const names = this.db.prepare(sql).all()
    return names
  }

  tournamentNameExists(tournamentName): boolean {
    this.createTourneyListTable()
    const query = `SELECT name FROM TourneyList WHERE name=?`
    const result = this.db.prepare(query).get(tournamentName)
    return result !== undefined
  }

  getPlayers(tournamentName: string): object[] {
    const sql = `SELECT * FROM ${tournamentName}_players`
    const names = this.db.prepare(sql).all()
    return names
  }

  playerNameExists(playerName, tournamentName): boolean {
    const { firstName, lastName } = playerName
    const sql = `SELECT firstname, lastname FROM ${tournamentName}_players WHERE firstname=? AND lastname=?`
    const result = this.db.prepare(sql).get(firstName, lastName)
    return result !== undefined
  }

  addPlayer(playerInfo, tournamentName: string): void {
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
    const query = `CREATE TABLE IF NOT EXISTS ${tournamentName}_standings(firstname TEXT NOT NULL, lastname TEXT NOT NULL, rating INT, score FLOAT, receivedBye INT NOT NULL, colors TEXT NOT NULL)`
    this.db.exec(query)

    // fill table with players and score of zero
    const sql = `SELECT * FROM ${tournamentName}_players`
    const players = this.db.prepare(sql).all()

    players.forEach((player: playerObject) => {
      const { firstname, lastname, rating } = player
      const fill_query = `INSERT INTO ${tournamentName}_standings (firstname, lastname, rating, score, receivedBye, colors) VALUES (?, ?, ?, ?, ?, ?)`
      this.db.prepare(fill_query).run(firstname, lastname, rating, 0, 0, '')
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
    return result !== undefined
  }

  getCurrentRound(tournamentName: string): number {
    // retrive from tourneylist table
    const currentRoundQuery = 'SELECT roundsComplete FROM TourneyList WHERE name = ?'
    const roundNumObj = this.db.prepare(currentRoundQuery).get(tournamentName)
    return roundNumObj.roundsComplete + 1
  }

  getRoundsCompleted(tournamentName: string): number {
    // retrive from tourneylist table
    const currentRoundQuery = 'SELECT roundsComplete FROM TourneyList WHERE name = ?'
    const roundNumObj = this.db.prepare(currentRoundQuery).get(tournamentName)
    return roundNumObj.roundsComplete
  }

  getTotalRounds(tournamentName: string): number {
    // retrive from tourneylist table
    const currentRoundQuery = 'SELECT totalRounds FROM TourneyList WHERE name = ?'
    const roundNumObj = this.db.prepare(currentRoundQuery).get(tournamentName)
    return roundNumObj.totalRounds
  }

  generatePairings(tournamentName: string): void {
    // set roundInProgress for tournamentName to 1
    const setRoundInProgressQuery = `UPDATE TourneyList SET roundInProgress=? WHERE name=?`
    this.db.prepare(setRoundInProgressQuery).run(1, tournamentName)

    const sql = `SELECT * FROM ${tournamentName}_standings`
    const playerStandings = this.db.prepare(sql).all()

    // call tournament-pairing api to generate pairings
    const playerObjects: swissPlayerObject[] = []

    playerStandings.map((player) => {
      playerObjects.push({
        id: `${player.firstname} ${player.lastname}`,
        score: player.score,
        rating: player.rating,
        receivedBye: player.receivedBye === 1 ? true : false,
        colors: player.colors === '' ? false : player.colors.split('')
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
      if (player2 === null) {
        this.db.prepare(fill_query).run(match, player1, '1-0', 'BYE')
      } else {
        this.db.prepare(fill_query).run(match, player1, 'x-x', player2)
      }
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

  tournamentComplete(tournamentName): boolean {
    // if final round is complete - complete tournament (display final standings)
    const roundsCompleted = this.getRoundsCompleted(tournamentName)
    const totalRounds = this.getTotalRounds(tournamentName)

    if (roundsCompleted === totalRounds) {
      return true
    }
    return false
  }

  allResultsFilled(tournamentName): boolean {
    const currentRound = this.getCurrentRound(tournamentName)
    const sql = `SELECT result FROM ${tournamentName}_round_${currentRound}`
    const results = this.db.prepare(sql).all()

    for (const result of results) {
      const resultStr = result.result
      if (resultStr === 'x-x') {
        return false
      }
    }
    return true
  }

  completeRound(tournamentName): void {
    // get results from current_round table and update score for standings
    const matches = this.getPairings(tournamentName)
    const drawQuery = `UPDATE ${tournamentName}_standings SET score = score + 0.5 WHERE firstname=? AND lastname=?`
    const winQuery = `UPDATE ${tournamentName}_standings SET score = score + 1 WHERE firstname=? AND lastname=?`
    const colorQuery = `UPDATE ${tournamentName}_standings SET colors = colors || ? WHERE firstname=? AND lastname=?`
    matches.map((pair: any) => {
      const [p1_firstname, p1_lastname] = pair.player1.split(' ')
      const [p2_firstname, p2_lastname] = pair.player2.split(' ')

      // update colors
      this.db.prepare(colorQuery).run('w', p1_firstname, p1_lastname)
      if (p2_firstname !== 'BYE') {
        this.db.prepare(colorQuery).run('b', p2_firstname, p2_lastname)
      }

      if (pair.result == '1/2-1/2') {
        // update score
        this.db.prepare(drawQuery).run(p1_firstname, p1_lastname)
        this.db.prepare(drawQuery).run(p2_firstname, p2_lastname)
      } else if (pair.result == '1-0') {
        this.db.prepare(winQuery).run(p1_firstname, p1_lastname)
      } else if (pair.result == '0-1') {
        this.db.prepare(winQuery).run(p2_firstname, p2_lastname)
      } else if (pair.result == 'x-x' && p2_firstname === 'BYE') {
        this.db.prepare(winQuery).run(p1_firstname, p1_lastname)
        const updateByeQuery = `UPDATE ${tournamentName}_standings SET receivedBye = 1 WHERE firstname=? AND lastname=?`
        this.db.prepare(updateByeQuery).run(p1_firstname, p1_lastname)
      }
    })

    // * CHANGE is round in progress back to 0
    const setRoundInProgressQuery = `UPDATE TourneyList SET roundInProgress=? WHERE name=?`
    this.db.prepare(setRoundInProgressQuery).run(0, tournamentName)

    // update round - can update without checking final round as a tournament can have at least one round
    // update roundsComplete in TourneyList
    const incrementRoundsCompleteQuery = `UPDATE TourneyList SET roundsComplete = roundsComplete + 1 WHERE name=?`
    this.db.prepare(incrementRoundsCompleteQuery).run(tournamentName)

    return
  }
}
