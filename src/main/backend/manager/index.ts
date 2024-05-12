import Manager from './manager'
import sqlite3 from 'sqlite3'
import path from 'path'

const sqlite3Verbose = sqlite3.verbose()

export default function getManagerObj(): Manager {
  // connect to db
  const db_path = path.join(
    __dirname,
    '..',
    '..',
    'src',
    'main',
    'backend',
    'db',
    'experimental.db'
  )

  const db = new sqlite3Verbose.Database(db_path, sqlite3Verbose.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
  })

  const managerObj = new Manager(db, '', '')
  return managerObj
}
