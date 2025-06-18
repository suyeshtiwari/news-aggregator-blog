const cors = require('cors');

module.exports = cors({
  origin: 'http://localhost:3000', // Adjust this if your frontend runs elsewhere
  credentials: true,
});
