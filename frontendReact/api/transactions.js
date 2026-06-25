import { authenticate } from './_auth.js';
import { connectToDatabase, Transaction } from './_db.js';

export default async function handler(req, res) {
  try {
    if (!authenticate(req, res)) return;
    await connectToDatabase();

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: 'Method not allowed.' });
    }

    const transactions = await Transaction
      .find({ userId: req.userId })
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json(transactions);
  } catch {
    return res.status(500).json({ message: 'Transaction API failed.' });
  }
}
