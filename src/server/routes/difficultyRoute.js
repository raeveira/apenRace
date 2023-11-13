console.log('difficultyRoute.js = Loaded');

const express = require('express');
const router = express.Router();
const difficultyController = require('../controllers/difficultyController');

// Save the selected difficulty preference for the logged-in user
router.post('/save-difficulty', (req, res) => {
  const username = req.session.username; // Using the username from the session
  const { difficulty } = req.body;

  difficultyController.saveDifficultyPreference(username, difficulty);

  res.sendStatus(200);
});


// Retrieve the selected difficulty preference for the logged-in user
router.get('/get-difficulty', (req, res) => {
  const username = req.session.username; // Using the username from the session

  difficultyController.getDifficultyPreference(username, (error, difficulty) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ difficulty });
    }
  });
});

module.exports = router;