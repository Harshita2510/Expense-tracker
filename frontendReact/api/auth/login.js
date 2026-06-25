import bcrypt from 'bcryptjs';
import { connectToDatabase, User } from '../_db.js';
import { publicUser, signToken } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });
  try {
    await connectToDatabase();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = await User.findOne({ email }).select('+password');
    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    return res.status(200).json({ token: signToken(user), user: publicUser(user) });
  } catch {
    return res.status(500).json({ message: 'Could not sign in.' });
  }
}
