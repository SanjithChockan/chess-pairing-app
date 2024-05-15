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
    const sql = 'INSERT INTO TourneyList (name) VALUES (?)'

    this.db.prepare(sql).run(name)
    console.log('Added Tournament Table to DB')
  }

  async loadTournaments(): string[] {
    // fetch rows from table and return it as list of string
    const sql = `SELECT * FROM TourneyList`

    return ['']
  }
}
