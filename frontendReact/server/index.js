import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

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

await mongoose.connect(mongoUri);

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
