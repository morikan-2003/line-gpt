const axios = require('axios');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

async function pushMessageToUser(userId, message) {
  console.log('📤 Push対象ユーザー:', userId);
  console.log('📤 送信メッセージ:', message);

  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    console.log('✅ LINE Push Success:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('❌ LINE Push Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    throw error;
  }
}

module.exports = { pushMessageToUser };
