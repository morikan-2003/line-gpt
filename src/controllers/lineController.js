// src/controllers/lineController.js
const { handleEvent } = require('../services/messageService');

async function lineWebhook(req, res) {
  try {
    const events = req.body.events;
    const results = await Promise.all(events.map(handleEvent));
    return res.json(results);
  } catch (err) {
    console.error('lineWebhook Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  lineWebhook,
};
