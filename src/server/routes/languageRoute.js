console.log('languageRoute.js = Loaded');

const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');

// Save the selected language preference for the logged-in user
router.post('/save-language', (req, res) => {
  const username = req.session.username; // Using the username from the session
  const { language } = req.body;

  languageController.saveLanguagePreference(username, language);

  res.sendStatus(200);
});

// Retrieve the selected language preference for the logged-in user
router.get('/get-language', (req, res) => {
  const username = req.session.username; // Using the username from the session

  languageController.getLanguagePreference(username, (error, language) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ language });
    }
  });
});

module.exports = router;
