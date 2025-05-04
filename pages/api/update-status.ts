import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import serviceAccount from '../../serviceAccountKey.json';

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}
const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id, newStatus } = req.body;

  if (!id || !newStatus) {
    return res.status(400).json({ message: 'Missing id or newStatus' });
  }

  try {
    await db.collection('unhandled_queries').doc(id).update({ status: newStatus });
    return res.status(200).json({ message: 'Status updated successfully' });
  } catch (err: any) {
    console.error('🔥 Firestore 更新失敗:', err);
    return res.status(500).json({ message: 'Firestore error', error: err.message });
  }
}
