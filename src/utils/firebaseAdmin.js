// src/utils/firebaseAdmin.ts
import admin from 'firebase-admin';

const base64 = process.env.FIREBASE_ADMIN_KEY_BASE64;
if (!base64) throw new Error('FIREBASE_ADMIN_KEY_BASE64 is not defined');

const serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString());

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
export { db };
