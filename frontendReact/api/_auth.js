import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error('Missing JWT_SECRET');
  return process.env.JWT_SECRET;
};

export const publicUser = (user) => ({
  id: user._id.toString(), email: user.email, name: user.name,
});

export const signToken = (user) => jwt.sign(
  { sub: user._id.toString(), email: user.email },
  getJwtSecret(),
  { expiresIn: '7d', issuer: 'budget-diary', audience: 'budget-diary-web' }
);

export const authenticate = (req, res) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Authentication required.' });
    return false;
  }
  try {
    const payload = jwt.verify(token, getJwtSecret(), {
      issuer: 'budget-diary', audience: 'budget-diary-web',
    });
    req.userId = payload.sub;
    return true;
  } catch {
    res.status(401).json({ message: 'Invalid or expired session.' });
    return false;
  }
};
