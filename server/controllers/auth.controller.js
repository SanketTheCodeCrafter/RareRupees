import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, message: 'username & password required' });

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = { role: 'admin', username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '8h'
    });

    return res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error('auth login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
