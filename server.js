const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
require('dotenv').config();
const cors = require('./middleware/cors');

app.use(cors);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api', require('./routes/reset'));

const db = require('./config/db');

app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'A personal portfolio website to showcase my projects and skills.',
      techStack: ['React', 'Node.js', 'Tailwind CSS'],
      githubUrl: 'https://github.com/yourusername/portfolio',
      liveUrl: 'https://yourportfolio.com',
    },
    {
      id: 2,
      title: 'E-commerce App',
      description: 'An e-commerce platform with user authentication and payment integration.',
      techStack: ['React', 'Express', 'MongoDB'],
      githubUrl: 'https://github.com/yourusername/ecommerce',
      liveUrl: 'https://yourecommerce.com',
    },
  ];

  res.json(projects);
});

// Store news articles
app.post('/api/news', (req, res) => {
  const articles = req.body.articles;
  if (!Array.isArray(articles)) {
    return res.status(400).json({ error: 'Articles should be an array.' });
  }
  const stmt = db.prepare('INSERT INTO news (title, description, url, image, source, publishedAt) VALUES (?, ?, ?, ?, ?, ?)');
  db.serialize(() => {
    articles.forEach(article => {
      stmt.run(
        article.title,
        article.description,
        article.url,
        article.image,
        article.source?.name || '',
        article.publishedAt
      );
    });
    stmt.finalize();
    res.json({ message: 'Articles stored successfully.' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});