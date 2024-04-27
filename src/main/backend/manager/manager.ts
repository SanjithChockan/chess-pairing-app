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

  createTournamentManager(): void {
    // create a Manager Table to store Tournament IDs and names if one doesn't exist
    // will be invoked in the start of application
    const sql = 'CREATE TABLE IF NOT EXISTS manager(id INTEGER PRIMARY KEY, tournament_name)'
    this.db.run(sql, (err) => {
      if (err) return console.error(err.message)
    })
  }

  createTournament(id: number): void {
    // generate a tournament ID and store in Tournaments table
    // and create tournament object and add to separate table with ID as foreign key
    // a new table must be created for every tournament
    const sql = `CREATE TABLE IF NOT EXISTS tournament_${id}(player_id INTEGER PRIMARY KEY)`
    this.db.run(sql, (err) => {
      if (err) return console.error(err.message)
    })
    console.log('Added tournament to table')
  }

  deleteTournament(id: number): void {
    // delete row from Tournaments and every other table that references id as foreign key
    const sql = `DROP TABLE IF EXISTS tournament_${id}`
    this.db.run(sql, (err) => {
      if (err) return console.error(err.message)
    })
  }

  loadTournamentsFromDB(): void {
    // load IDs and tournament names to display for user
  }
}
