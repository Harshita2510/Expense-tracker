import { GoogleGenAI } from '@google/genai';
import { authenticate } from '../_auth.js';
import { connectToDatabase, Transaction } from '../_db.js';

const systemInstruction = `
You are a strict financial transaction parser for a personal finance app.
Extract transaction details from the user's raw sentence.
The user may mention one transaction or ramble multiple transactions in one sentence.

Return ONLY one raw JSON object.
Do not return markdown.
Do not wrap the JSON in backticks.
Do not include explanations.

The JSON object must contain exactly these fields:
{
  "language": string,
  "roast": string,
  "transactions": [
    {
      "amount": number | null,
      "type": "income" | "expense",
      "category": string,
      "description": string,
      "paymentMethod": "Cash" | "UPI"
    }
  ]
}

Rules:
- The user may speak in English, Hinglish, Hindi, Marathi, Gujarati, Tamil, Telugu, Bengali, Kannada, Malayalam, Punjabi, or any other Indian language.
- Detect the user's language/style and put it in "language".
- Store every transaction's category and description in clean English only, regardless of the user's spoken language.
- The "roast" must be one short funny sarcastic sentence in the same language/style the user used. If they used Hinglish, reply in Hinglish. If they used Hindi, reply in Hindi. If they used English, reply in English.
- paymentMethod must be "Cash" only if the user clearly says cash/cash payment/paid in cash. Otherwise paymentMethod must be "UPI".
- amount must be a positive number.
- Never guess or invent an amount.
- If any item does not have a clear amount, do not include that item.
- If no item has a clear amount, return { "transactions": [] }.
- type must be "income" when money is received or earned.
- type must be "expense" when money is spent, paid, sent, bought, or charged.
- category should be short and human-readable, such as Food, Travel, Shopping, Bills, Salary, Refund, Health, Entertainment, Education, Other.
- description should summarize the transaction in plain language.
- If a category is unclear, use category "Other".
`;

const cleanJsonText = (text = '') => text
  .trim()
  .replace(/^```(?:json)?\s*/i, '')
  .replace(/\s*```$/i, '');

const parseAiTransactions = (text) => {
  const parsed = JSON.parse(cleanJsonText(text));
  const rawTransactions = Array.isArray(parsed.transactions)
    ? parsed.transactions
    : [parsed];

  const transactions = rawTransactions.map((transaction) => {
    const amount = Number(transaction.amount);
    const type = String(transaction.type || '').toLowerCase();
    const category = String(transaction.category || '').trim();
    const description = String(transaction.description || '').trim();
    const paymentMethod = String(transaction.paymentMethod || '').trim().toLowerCase() === 'cash'
      ? 'Cash'
      : 'UPI';

    if (!Number.isFinite(amount) || amount <= 0) return null;

    if (!['income', 'expense'].includes(type)) {
      throw new Error('AI returned an invalid transaction type.');
    }

    if (!category) {
      throw new Error('AI returned an empty category.');
    }

    return { amount, type, category, description, paymentMethod };
  }).filter(Boolean);

  if (transactions.length === 0) {
    throw new Error('AI returned no valid transactions with amounts.');
  }

  return {
    language: String(parsed.language || 'English').trim(),
    roast: String(parsed.roast || '').trim(),
    transactions,
  };
};

export default async function handler(req, res) {
  try {
    if (!authenticate(req, res)) return;

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: 'Method not allowed.' });
    }

    await connectToDatabase();

    const text = String(req.body?.text || '').trim();

    if (!text) {
      return res.status(400).json({ message: 'Please send transaction text.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Missing GEMINI_API_KEY.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseAiTransactions(response.text);
    const transactions = await Transaction.insertMany(parsed.transactions.map((transaction) => ({
      ...transaction,
      userId: req.userId,
    })));

    return res.status(201).json({
      language: parsed.language,
      roast: parsed.roast,
      transactions,
    });
  } catch (error) {
    const message = error?.message || 'Could not create transaction from text.';
    const isParseError = error instanceof SyntaxError
      || message.includes('AI returned');

    return res.status(isParseError ? 422 : 500).json({
      message: isParseError
        ? 'AI could not find a clear transaction amount. Please say the amount clearly.'
        : 'Transaction AI API failed.',
      detail: process.env.NODE_ENV === 'production' ? undefined : message,
    });
  }
}
