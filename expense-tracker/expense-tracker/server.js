require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// सारे खर्चे
app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, amount, category, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM expenses ORDER BY date DESC, id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// नया खर्चा
app.post('/api/expenses', async (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title || !amount || !date) {
    return res.status(400).json({ error: 'title, amount और date ज़रूरी हैं' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)',
      [title, amount, category, date]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// खर्चा एडिट
app.put('/api/expenses/:id', async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    await db.query(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?',
      [title, amount, category, date, req.params.id]
    );
    res.json({ message: 'अपडेट हो गया' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// खर्चा हटाओ
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.json({ message: 'हटा दिया गया' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server चल रहा है: http://localhost:${PORT}`));
