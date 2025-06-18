const { findUserByUsername } = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// In-memory store for reset tokens (for demo/dev only)
const resetTokens = {};

exports.forgotPassword = (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  findUserByUsername(username, (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    const token = crypto.randomBytes(20).toString('hex');
    resetTokens[token] = { username, expires: Date.now() + 1000 * 60 * 15 }; // 15 min expiry
    // In production, email this token to the user
    res.json({ message: 'Reset token generated', token });
  });
};

exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });
  const data = resetTokens[token];
  if (!data || data.expires < Date.now()) return res.status(400).json({ error: 'Invalid or expired token' });
  findUserByUsername(data.username, (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Error hashing password' });
      const db = require('../config/db');
      db.run('UPDATE users SET password = ? WHERE username = ?', [hash, data.username], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to reset password' });
        delete resetTokens[token];
        res.json({ message: 'Password reset successful' });
      });
    });
  });
};
