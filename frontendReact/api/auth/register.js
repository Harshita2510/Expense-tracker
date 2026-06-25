import bcrypt from 'bcryptjs';
import { connectToDatabase, User } from '../_db.js';
import { publicUser, signToken } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });
  try {
    await connectToDatabase();
    const email = String(req.body.email || '').trim().toLowerCase();
    const name = String(req.body.name || '').trim();
    const password = String(req.body.password || '');
    if (!email || !name || !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include a letter and a number.' });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const user = await User.create({ email, name, password: await bcrypt.hash(password, 12) });
    return res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'Account already exists.' });
    return res.status(500).json({ message: 'Could not create account.' });
  }
}
