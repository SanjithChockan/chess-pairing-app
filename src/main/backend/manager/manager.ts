import Database from 'better-sqlite3'

export default class Manager {
  db: Database
  name: string
  format: string

  constructor(db: Database, name: string, format: string) {
    this.db = db
    this.name = name
    this.format = format
  }

  createTournament(name: string): void {
    // add tournament to tourney list
    const sql = 'INSERT INTO TourneyList (name) VALUES (?)'
    this.db.prepare(sql).run(name)
    console.log('Added Tournament Table to DB')

    // create table for tournament to store player information
    const query = `CREATE TABLE IF NOT EXISTS ${name}_players(firstname TEXT NOT NULL, lastname TEXT NOT NULL)`
    this.db.exec(query)
  }

  loadTournaments(): object[] {
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

  addPlayer(playerName: string, tournamentName: string): void {
    const sql = `INSERT INTO ${tournamentName} VALUES (?)`
    this.db.prepare(sql).run(playerName)
    console.log('Added player to table')
  }
}
