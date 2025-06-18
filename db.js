// db.js
// This file handles DB connection and migration logic.
// Uses SQLite for local development. For MySQL, see comments below.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// For SQLite (local/H2-like dev)
const db = new sqlite3.Database(path.join(__dirname, 'news.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    url TEXT,
    image TEXT,
    source TEXT,
    publishedAt TEXT
  )`);
});

module.exports = db;

/*
// For MySQL migration, use the following instead:
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});
// Replace all sqlite3 queries with MySQL queries.
*/
