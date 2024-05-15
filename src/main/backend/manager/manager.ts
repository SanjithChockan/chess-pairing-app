import sqlite3 from 'sqlite3'

export default class Manager {
  db: sqlite3.Database
  name: string
  format: string

  constructor(db: sqlite3.Database, name: string, format: string) {
    this.db = db
    this.name = name
    this.format = format
  }

  createTournament(name: string): void {
    const sql = `INSERT INTO TourneyList VALUES ('${name}')`
    this.db.run(sql, (err) => {
      if (err) return console.error(err.message)
    })
    console.log('Added Tournament Table to DB')
  }

  loadTournaments(): string[] {
    // fetch rows from table and return it as list of string
    const sql = `SELECT * FROM TourneyList`
    this.db.all(sql, (_error, rows) => {
      rows.forEach((row) => {
        console.log(row.name)
      })
    })

    return ['this', 'is', 'a', 'test']
  }
}
