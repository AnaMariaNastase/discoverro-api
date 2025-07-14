import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Corect: cale absolută către fișierul JSON
const jsonPath = path.join(__dirname, 'data.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// ✅ Rute API
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Travel JSON API' });
});

app.get('/packages', (req, res) => {
  res.json(jsonData.data);
});

app.get('/package/:id', (req, res) => {
  const pkg = jsonData.data.find(item => item._id === req.params.id);
  if (!pkg) {
    return res.status(404).json({ error: 'Package not found' });
  }
  res.json(pkg);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
