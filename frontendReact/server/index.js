import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('Missing MONGODB_URI. Create a .env file from .env.example.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

const expenseSchema = new mongoose.Schema(
  {
    Datee: {
      type: String,
      required: true,
    },
    ModeOfPayment: {
      type: String,
      default: '',
      trim: true,
    },
    Incoming: {
      type: Number,
      default: 0,
      min: 0,
    },
    Outgoing: {
      type: Number,
      default: 0,
      min: 0,
    },
    Expense: {
      type: String,
      required: true,
      trim: true,
    },
    Description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);

const refundSchema = new mongoose.Schema(
  {
    Datee: {
      type: String,
      required: true,
    },
    ModeOfPayment: {
      type: String,
      required: true,
      trim: true,
    },
    Amount: {
      type: Number,
      required: true,
      min: 0,
    },
    Description: {
      type: String,
      default: '',
      trim: true,
    },
    Status: {
      type: String,
      enum: ['pending', 'done'],
      default: 'pending',
    },
    CompletedDate: {
      type: String,
      default: '',
    },
    IncomingExpenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      default: null,
    },
  },
  { timestamps: true }
);

const Refund = mongoose.model('Refund', refundSchema);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ Datee: -1, createdAt: -1 });
    res.json(expenses);
  } catch {
    res.status(500).json({ message: 'Could not load expenses.' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const expense = await Expense.create({
      Datee: req.body.Datee,
      ModeOfPayment: req.body.ModeOfPayment,
      Incoming: Number(req.body.Incoming || 0),
      Outgoing: Number(req.body.Outgoing || 0),
      Expense: req.body.Expense,
      Description: req.body.Description,
    });

    res.status(201).json(expense);
  } catch {
    res.status(400).json({ message: 'Could not save expense.' });
  }
});

app.get('/api/refunds', async (req, res) => {
  try {
    const refunds = await Refund.find().sort({ Status: -1, createdAt: -1 });
    res.json(refunds);
  } catch {
    res.status(500).json({ message: 'Could not load refunds.' });
  }
});

app.post('/api/refunds', async (req, res) => {
  try {
    const refund = await Refund.create({
      Datee: req.body.Datee,
      ModeOfPayment: req.body.ModeOfPayment,
      Amount: Number(req.body.Amount || 0),
      Description: req.body.Description,
    });

    res.status(201).json(refund);
  } catch {
    res.status(400).json({ message: 'Could not save refund.' });
  }
});

app.patch('/api/refunds/:id/done', async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({ message: 'Refund not found.' });
    }

    if (refund.Status === 'done') {
      const existingExpense = refund.IncomingExpenseId
        ? await Expense.findById(refund.IncomingExpenseId)
        : null;

      return res.json({ refund, expense: existingExpense });
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

    res.json({ refund, expense });
  } catch {
    res.status(400).json({ message: 'Could not mark refund as done.' });
  }
});

app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

await mongoose.connect(mongoUri);

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
