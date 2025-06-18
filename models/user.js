const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = (username, password, role = 'user', email = '', location = '', website = '', address = '', cb) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return cb(err);
    db.run(
      'INSERT INTO users (username, password, role, email, location, website, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, hash, role, email, location, website, address],
      function (err) {
        if (err) return cb(err);
        cb(null, { id: this.lastID, username, role, email, location, website, address });
      }
    );
  });
};

const findUserByUsername = (username, cb) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], cb);
};

const updateUserProfile = (id, { email, location, website, address }, cb) => {
  db.run(
    'UPDATE users SET email = ?, location = ?, website = ?, address = ? WHERE id = ?',
    [email, location, website, address, id],
    function (err) {
      if (err) return cb(err);
      db.get('SELECT * FROM users WHERE id = ?', [id], cb);
    }
  );
};

module.exports = { createUser, findUserByUsername, updateUserProfile };
