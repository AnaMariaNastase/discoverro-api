import express from 'express';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

const jsonData = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

// Basic routes
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
