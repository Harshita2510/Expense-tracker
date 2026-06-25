import mongoose from 'mongoose';

let connectionPromise;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, select: false },
  },
  { timestamps: true }
);

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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

const refundSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
export const Refund = mongoose.models.Refund || mongoose.model('Refund', refundSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
  }

  connectionPromise ||= mongoose.connect(process.env.MONGODB_URI);
  await connectionPromise;
};
