const router = require('express').Router();
const fetch = require('node-fetch');

router.route('/daily').get(async (req, res) => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const quote = await response.json();
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily quote', error });
  }
});

module.exports = router;
