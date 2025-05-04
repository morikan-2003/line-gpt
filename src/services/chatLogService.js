const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getApps, initializeApp, cert } = require('firebase-admin/app');
const serviceAccount = require('../../serviceAccountKey.json');

// Firebase Admin 初期化
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}
const db = getFirestore();

/**
 * チャット履歴を Firestore に保存する関数
 * @param {string} userId - LINEのユーザーID
 * @param {'user' | 'assistant'} sender - 発言者の区分
 * @param {string} message - メッセージ内容
 */
async function saveChatHistory(userId, sender, message) {
  const userDocRef = db.doc(`chats/${userId}`); // ← ここを修正

  // ユーザー情報を保存（初回のみ or 上書き）
  await userDocRef.set(
    {
      userId,
      createdAt: Timestamp.now(),
    },
    { merge: true }
  );

  // メッセージのサブコレクションに追加
  const messagesRef = db.collection(`chats/${userId}/messages`);
  await messagesRef.add({
    sender,
    message,
    timestamp: Timestamp.now(),
  });
}

module.exports = {
  saveChatHistory,
};
