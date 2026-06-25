import { connectToDatabase, Expense } from './_db.js';
import { authenticate } from './_auth.js';

export default async function handler(req, res) {
  try {
    if (!authenticate(req, res)) return;
    await connectToDatabase();

    if (req.method === 'GET') {
      const expenses = await Expense.find({ user: req.userId }).sort({ Datee: -1, createdAt: -1 });
      return res.status(200).json(expenses);
    }

    if (req.method === 'POST') {
      const expense = await Expense.create({
        user: req.userId,
        Datee: req.body.Datee,
        ModeOfPayment: req.body.ModeOfPayment,
        Incoming: Number(req.body.Incoming || 0),
        Outgoing: Number(req.body.Outgoing || 0),
        Expense: req.body.Expense,
        Description: req.body.Description,
      });

      return res.status(201).json(expense);
    }

    if (req.method === 'DELETE') {
      const expenseId = req.query.id || req.body?.id;

      if (!expenseId) {
        return res.status(400).json({ message: 'Entry id is required.' });
      }

      const deletedExpense = await Expense.findOneAndDelete({
        _id: expenseId,
        user: req.userId,
      });

      if (!deletedExpense) {
        return res.status(404).json({ message: 'Entry not found.' });
      }

      return res.status(200).json({ deletedId: deletedExpense._id });
    }

    return res.status(405).json({ message: 'Method not allowed.' });
  } catch {
    return res.status(500).json({ message: 'Expense API failed.' });
  }
}
