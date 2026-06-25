# GuiltTrip

GuiltTrip is a personal finance tracker with a personality problem.

Most budgeting apps feel like spreadsheets wearing a nicer font. GuiltTrip is different: it lets you speak naturally, logs your spending intelligently, and responds with just enough sarcasm to make you remember the purchase.

It is built for real everyday users — people who say things like:

> “Hey dear, aaj 500 rupaye ka petrol dalwaya.”

GuiltTrip turns that into clean structured data:

```txt
Amount: ₹500
Type: Expense
Category: Transport
Payment: UPI
Description: Petrol refill
```

Then it roasts you in the same language you spoke.

## The pitch

Fintech apps assume users speak perfect English, enter clean forms, and enjoy financial discipline. Real people do none of that.

GuiltTrip is a voice-first expense tracker that understands messy, multilingual, everyday money talk. It accepts English, Hindi, Hinglish, and other Indian language-style input through speech, extracts structured transactions using Gemini, and stores them in a clean MongoDB database.

The product experience is intentionally memorable:

- Open the app.
- See a sarcastic meme card.
- Tap it.
- Say “hey dear”.
- Ramble naturally.
- Watch GuiltTrip log your damage.

It is fast, funny, and surprisingly practical.

## Key features

### Voice-first transaction logging

Speak instead of typing:

```txt
Hey dear, I spent 200 on Zomato, 50 for auto, and 500 on a shirt.
```

GuiltTrip can split that ramble into multiple entries.

### Multilingual AI parsing

Users can speak naturally:

```txt
Hey dear, aaj 20 rupaye biscuit par kharch kiye.
```

The database still stores clean English fields, while the AI reply keeps the user’s language and tone.

### Same-language AI roast

If the user speaks Hinglish, the roast comes back in Hinglish.

```txt
Logged 1 item.
AI says: "₹20 biscuit pe? Budget ka bhi glucose level low hai."
```

### Wake phrase flow

The app waits for:

```txt
hey dear
```

Only the transaction after the wake phrase is sent to Gemini. Random speech before the wake phrase is ignored.

### Ramble mode

One voice input can create multiple transactions. No need to record one item at a time.

### Weekly Receipt of Shame

A dark receipt-style recap showing the top weekly expenses, sarcastic comments, total damage, and a shareable social-style format.

### PIN unlock

After logging in once, users can set a 4-digit local PIN for quick device unlock.

### Refund tracking

Track pending refunds separately and mark them done when the money arrives. Completed refunds automatically become income entries.

### Hidden delete gesture

Tap a transaction six times to delete it. Slightly dramatic, intentionally hard to do by accident.

## Tech stack

```txt
Frontend: React + Vite
Styling: CSS
Backend: Vercel Serverless API routes + local Express adapter
Database: MongoDB + Mongoose
Authentication: Custom JWT + bcryptjs
AI: Google Gemini API via @google/genai
Deployment: Vercel
```

## AI architecture

The AI endpoint receives raw text:

```txt
POST /api/transactions/ai
```

Example input:

```json
{
  "text": "hey dear aaj 500 rupaye petrol cash mein"
}
```

Gemini returns structured JSON:

```json
{
  "language": "Hinglish",
  "roast": "₹500 ka petrol? Gaadi chal rahi hai ya budget jal raha hai?",
  "transactions": [
    {
      "amount": 500,
      "type": "expense",
      "category": "Transport",
      "description": "Petrol refill",
      "paymentMethod": "Cash"
    }
  ]
}
```

The backend validates the response, attaches the authenticated user ID, saves the AI transaction, and records a normal dashboard entry.

## Payment mode rule

For AI entries:

```txt
If user clearly says cash → Cash
Otherwise → UPI
```

This keeps voice logging fast and predictable.

## Security

- Passwords are hashed with bcrypt.
- JWTs protect all user data routes.
- MongoDB records are scoped to the authenticated user.
- PIN is stored locally as a SHA-256 hash, not plain text.
- Backend secrets stay in environment variables.

## Environment variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

For Vercel, add the same backend secrets in Project Settings → Environment Variables.

Do not prefix backend secrets with `VITE_`.

## Run locally

Install dependencies:

```bash
npm install
```

Run full local app:

```bash
npm run local
```

Open:

```txt
http://localhost:3000
```

Frontend-only quick preview:

```bash
npm run dev
```

## Build check

```bash
npm run lint
npm run build
```

## Why this project matters

GuiltTrip is not just another CRUD expense tracker. It demonstrates:

- Voice-first UX
- Multilingual AI input
- Structured data extraction from messy natural speech
- Stateless JWT authentication
- MongoDB user scoping
- Serverless backend design
- AI-assisted personalization
- A memorable product identity

It turns a boring finance app into something people actually remember.

## Product one-liner

GuiltTrip is a multilingual, voice-first expense tracker that logs your spending and roasts you just enough to make better choices next time.
