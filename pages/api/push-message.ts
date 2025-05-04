// pages/api/push-message.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ message: 'Missing userId or message' });
  }

  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [{ type: 'text', text: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({ message: 'Message sent successfully', response: response.data });
  } catch (err: any) {
    console.error('LINE push message error:', err.response?.data || err.message);
    return res.status(500).json({ message: 'LINE push error', error: err.message });
  }
}
