// src/services/logService.js
const { db } = require('../utils/firebaseAdmin');

async function logUserQuery({ userId, message, response, relevantContext }) {
  await db.collection('user_query_logs').add({
    userId,
    message,
    response,
    relevantContext,
    timestamp: new Date()
  });
}

async function logUnhandledQuery({ userId, message, reason = 'No relevant RAG context' }) {
  await db.collection('unhandled_queries').add({
    userId,
    message,
    reason,
    status: 'unreviewed',
    timestamp: new Date()
  });
}

module.exports = {
  logUserQuery,
  logUnhandledQuery,
};
