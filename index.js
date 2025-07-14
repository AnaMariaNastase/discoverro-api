import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Citire date din JSON
const jsonPath = path.join(__dirname, 'data.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// ✅ Ruta de test
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Travel JSON API' });
});

// ✅ Ruta principală compatibilă cu frontendul tău
app.get('/api/package', (req, res) => {
  const { type, priceRange, rating, page = 1 } = req.query;

  let filteredData = [...jsonData.data];

  // Filtrare după tip
  if (type) {
    filteredData = filteredData.filter((item) => item.type === type);
  }

  // Filtrare după preț
  if (priceRange) {
    if (priceRange === 'less 500') {
      filteredData = filteredData.filter((item) => item.pricePerAdult < 500);
    } else if (priceRange === 'more than 1500') {
      filteredData = filteredData.filter((item) => item.pricePerAdult > 1500);
    } else {
      const [min, max] = priceRange.split('-').map(Number);
      filteredData = filteredData.filter(
        (item) => item.pricePerAdult >= min && item.pricePerAdult <= max
      );
    }
  }

  // Filtrare după rating
  if (rating) {
    filteredData = filteredData.filter(
      (item) => Math.round(item.rating) === Number(rating)
    );
  }

  // Paginare (5 elemente per pagină)
  const pageSize = 5;
  const startIndex = (page - 1) * pageSize;
  const paginated = filteredData.slice(startIndex, startIndex + pageSize);

  res.json({ data: paginated });
});

// ✅ Ruta pentru detalii pachet
app.get('/api/package/:id', (req, res) => {
  const _package = jsonData.data.find(item => item._id === req.params.id);
  if (!_package) {
    return res.status(404).json({ error: 'Package not found' });
  }
  res.json(_package);
});

// ✅ Pornirea serverului
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
