console.log('difficultyRoute.js = Loaded');

const express = require('express');
const router = express.Router();
const leaderController = require('../controllers/leaderController');

// Save the selected difficulty preference for the logged-in user
router.post('/save-leaderboard', (req, res) => {
  const { username, wins } = req.body;

  leaderController.saveLeaderPreference(username, wins);

  res.sendStatus(200);
});


// Retrieve the selected difficulty preference for the logged-in user
router.get('/get-leaderboard', (req, res) => {
  const username = req.session.username; // Using the username from the session

  leaderController.getLeaderboardData(username, (error, wins) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ wins });
    }
  });
});

module.exports = router;