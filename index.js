import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Cale absolută către fișierul JSON
const jsonPath = path.join(__dirname, 'data.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// ✅ Rute simple
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Travel JSON API' });
});

app.get('/destinations', (req, res) => {
  res.json(jsonData.data);
});

app.get('/destination/:id', (req, res) => {
  const destination = jsonData.data.find(item => item._id === req.params.id);
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  res.json(destination);
});

// ✅ Rută pentru filtrare și paginare
app.get('/api/package', (req, res) => {
  let results = jsonData.data;
  const { type, priceRange, rating, page = 1, limit = 10 } = req.query;

  if (type) {
    results = results.filter(item => item.type === type);
  }

  if (priceRange) {
    results = results.filter(item => item.priceRange === priceRange);
  }

  if (rating) {
    results = results.filter(item => Math.floor(item.rating) === parseInt(rating));
  }

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + Number(limit));

  res.json({ data: paginated });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
