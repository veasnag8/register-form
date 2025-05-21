const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hardcoded admin (insert on first run)
router.post('/init', async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin@123',
        role: 'admin'
      });
      await admin.save();
    }
    res.status(200).send('Admin initialized');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// User registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;