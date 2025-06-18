const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../data/app.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    email TEXT,
    location TEXT,
    website TEXT,
    address TEXT
  )`);
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
