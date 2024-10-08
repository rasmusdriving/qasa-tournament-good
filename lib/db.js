const Database = require('better-sqlite3');

const db = new Database('tournament.db', { verbose: console.log });

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    isPublic INTEGER DEFAULT 0,
    isPromoted INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    members TEXT,
    tournamentId INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
  );

  CREATE TABLE IF NOT EXISTS matchups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    round INTEGER,
    teamAId INTEGER,
    teamBId INTEGER,
    winnerId INTEGER,
    tournamentId INTEGER,
    points INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    matchupId INTEGER,
    teamId INTEGER,
    amount REAL,
    odds REAL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert a sample tournament
const insertTournament = db.prepare(`
  INSERT INTO tournaments (name, description, isPublic, isPromoted)
  VALUES (?, ?, ?, ?)
`);

insertTournament.run('Sample Tournament', 'This is a sample tournament', 1, 1);

module.exports = db;