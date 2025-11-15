import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ message: 'Unauthorized' });

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    req.admin = decoded;
    next();
  } catch (err) {
    console.error('adminAuth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default adminAuth;
