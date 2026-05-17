import { connectToDatabase, Expense, Refund } from '../../_db.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method !== 'PATCH') {
      return res.status(405).json({ message: 'Method not allowed.' });
    }

    const refund = await Refund.findById(req.query.id);

    if (!refund) {
      return res.status(404).json({ message: 'Refund not found.' });
    }

    if (refund.Status === 'done') {
      const existingExpense = refund.IncomingExpenseId
        ? await Expense.findById(refund.IncomingExpenseId)
        : null;

      return res.status(200).json({ refund, expense: existingExpense });
    }

    const completedDate = req.body.CompletedDate || new Date().toISOString().slice(0, 10);
    const expense = await Expense.create({
      Datee: completedDate,
      ModeOfPayment: refund.ModeOfPayment,
      Incoming: refund.Amount,
      Outgoing: 0,
      Expense: 'Refund',
      Description: refund.Description
        ? `Refund received: ${refund.Description}`
        : 'Refund received',
    });

    refund.Status = 'done';
    refund.CompletedDate = completedDate;
    refund.IncomingExpenseId = expense._id;
    await refund.save();

    return res.status(200).json({ refund, expense });
  } catch {
    return res.status(500).json({ message: 'Could not mark refund as done.' });
  }
}
