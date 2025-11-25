require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const ai = require('./ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple health endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'FortuneOne Voice Assistant is running' });
});

// Simple text chat endpoint used by voice widget
app.post('/ai-chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message_required' });
    }

    const reply = await ai.simpleReply(message);
    res.json({ reply });
  } catch (err) {
    console.error('Error in /ai-chat:', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Serve static frontend for widget
app.use('/voice-widget', express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`FortuneOne Voice Assistant backend listening on port ${PORT}`);
});
