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
    const createTourneyListQuery = `CREATE TABLE IF NOT EXISTS TourneyList(name TEXT NOT NULL, totalRounds INT NOT NULL, roundsComplete INT NOT NULL)`
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
    const query = `CREATE TABLE IF NOT EXISTS ${tournamentName}_standings(firstname TEXT NOT NULL, lastname TEXT NOT NULL, rating INT, score INT)`
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
    console.log(`getting current standings for ${tournamentName}`)
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
    console.log(`checking if round is in progress for ${tournamentName}`)
    console.log(result)
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
        id: player.firstname,
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
    const currentRound = this.getCurrentRound(tournamentName)
    const updateResultQuery = `UPDATE ${tournamentName}_round_${currentRound} SET result=? WHERE match_id=?`
    this.db.prepare(updateResultQuery).run(result, match_id)
    return
  }

  completeRound(tournamentName): void {
    // calculate new score based on result on each match
    // update standings
    console.log(tournamentName)
    return
  }
}
