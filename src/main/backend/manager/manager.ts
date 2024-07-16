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
    const createTourneyListQuery = `CREATE TABLE IF NOT EXISTS TourneyList(name TEXT NOT NULL, totalRounds INT NOT NULL, roundsComplete INT NOT NULL)`
    this.db.exec(createTourneyListQuery)

    // add tournament to tourney list
    const insertTourneyQuery =
      'INSERT INTO TourneyList (name, totalRounds, roundsComplete) VALUES (?, ?, ?)'
    this.db.prepare(insertTourneyQuery).run(name, roundNums, 0)

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
    const sql = `SELECT * FROM ${tournamentName}_standings`
    const playerStandings = this.db.prepare(sql).all()
    return playerStandings
  }

  checkStandings(tournamentName: string): boolean {
    const query = `SELECT name FROM sqlite_master WHERE type='table' AND lower(name)=lower(?)`
    const result = this.db.prepare(query).get(`${tournamentName}_standings`)
    return result !== undefined
  }

  generatePairings(tournamentName: string, roundNum: number): void {
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
    // returns an array of matches
    const matches = Swiss(playerObjects, roundNum)
    console.log(JSON.stringify(matches))
    return
  }
}
