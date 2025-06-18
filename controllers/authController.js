const { createUser, findUserByUsername } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { username, password, role, email, location, website, address } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  createUser(username, password, role, email, location, website, address, (err, user) => {
    if (err) return res.status(400).json({ error: 'User already exists' });
    res.json({ message: 'User registered', user });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  findUserByUsername(username, (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });
      res.json({ token });
    });
  });
};
