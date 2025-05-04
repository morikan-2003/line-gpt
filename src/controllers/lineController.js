// src/controllers/lineController.js
const { handleEvent } = require('../services/messageService');

async function lineWebhook(req, res) {
  const events = req.body.events || [];

  await Promise.all(events.map((event) => handleEvent(event)));

  return res.status(200).send('OK');
}

module.exports = {
  lineWebhook,
};
