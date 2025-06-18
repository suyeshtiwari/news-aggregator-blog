const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'devsecret', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

const authorize = (roles = []) => (req, res, next) => {
  if (!roles.length || roles.includes(req.user.role)) return next();
  return res.status(403).json({ error: 'Forbidden' });
};

module.exports = { auth, authorize };
