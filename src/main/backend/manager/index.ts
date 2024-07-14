import Manager from './manager'
import path from 'path'
import Database from 'better-sqlite3'

export default function getManagerObj(): Manager {
  // connect to db
  const db_path = path.join(__dirname, '..', '..', 'src', 'main', 'backend', 'db', 'pairing.db')

  const db = new Database(db_path)
  const managerObj = new Manager(db, '', '')
  return managerObj
}
