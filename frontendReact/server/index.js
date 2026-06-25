import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import healthHandler from '../api/health.js';
import expensesHandler from '../api/expenses.js';
import refundsHandler from '../api/refunds.js';
import refundDoneHandler from '../api/refunds/[id]/done.js';
import transactionsHandler from '../api/transactions.js';
import transactionAiHandler from '../api/transactions/ai.js';
import loginHandler from '../api/auth/login.js';
import registerHandler from '../api/auth/register.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const app = express();
const port = process.env.PORT || 3000;
const host = '127.0.0.1';

app.use(cors());
app.use(express.json());

const adaptApiHandler = (handler, beforeHandler) => async (req, res) => {
  if (beforeHandler) beforeHandler(req);
  return handler(req, res);
};

app.all('/api/health', adaptApiHandler(healthHandler));
app.all('/api/auth/login', adaptApiHandler(loginHandler));
app.all('/api/auth/register', adaptApiHandler(registerHandler));
app.all('/api/expenses', adaptApiHandler(expensesHandler));
app.all('/api/refunds', adaptApiHandler(refundsHandler));
app.all('/api/refunds/:id/done', adaptApiHandler(refundDoneHandler, (req) => {
  req.query = { ...req.query, id: req.params.id };
}));
app.all('/api/transactions', adaptApiHandler(transactionsHandler));
app.all('/api/transactions/ai', adaptApiHandler(transactionAiHandler));

app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(port, host, () => {
  console.log(`GuiltTrip running locally at http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Could not start local server:', error);
  process.exit(1);
});
