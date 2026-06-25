import { connectToDatabase, Refund } from './_db.js';
import { authenticate } from './_auth.js';

export default async function handler(req, res) {
  try {
    if (!authenticate(req, res)) return;
    await connectToDatabase();

    if (req.method === 'GET') {
      const refunds = await Refund.find({ user: req.userId }).sort({ Status: -1, createdAt: -1 });
      return res.status(200).json(refunds);
    }

    if (req.method === 'POST') {
      const refund = await Refund.create({
        user: req.userId,
        Datee: req.body.Datee,
        ModeOfPayment: req.body.ModeOfPayment,
        Amount: Number(req.body.Amount || 0),
        Description: req.body.Description,
      });

      return res.status(201).json(refund);
    }

    return res.status(405).json({ message: 'Method not allowed.' });
  } catch {
    return res.status(500).json({ message: 'Refund API failed.' });
  }
}
