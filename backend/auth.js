const express = require('express');
const router = express.Router();

// Mock user data
const users = [
  { id: 1, username: 'test', password: 'password' }
];

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, message: 'Logged in successfully' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Signup route
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    res.status(409).json({ success: false, message: 'Username already exists' });
  } else {
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    res.json({ success: true, message: 'Signed up successfully' });
  }
});

module.exports = router;
