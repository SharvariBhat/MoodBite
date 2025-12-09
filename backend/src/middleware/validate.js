const validateRecipeRequest = (req, res, next) => {
  const { mood } = req.body;

  if (!mood || typeof mood !== 'string' || mood.trim().length === 0) {
    return res.status(400).json({ error: 'Mood is required and must be a non-empty string' });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  next();
};

module.exports = { validateRecipeRequest, validateRegister };
