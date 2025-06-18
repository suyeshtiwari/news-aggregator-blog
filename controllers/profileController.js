const { findUserByUsername, updateUserProfile } = require('../models/user');

exports.getProfile = (req, res) => {
  const username = req.user.username;
  findUserByUsername(username, (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    const { password, ...userData } = user;
    res.json(userData);
  });
};

exports.updateProfile = (req, res) => {
  console.log('Decoded user from token:', req.user); // DEBUG
  const id = req.user.id;
  const { email, location, website, address } = req.body;
  console.log('Update request body:', req.body); // DEBUG
  updateUserProfile(id, { email, location, website, address }, (err, user) => {
    if (err || !user) {
      console.error('Update error:', err); // DEBUG
      return res.status(400).json({ error: 'Update failed' });
    }
    const { password, ...userData } = user;
    res.json(userData);
  });
};
