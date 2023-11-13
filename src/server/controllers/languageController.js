console.log('languageController.js = Loaded');

const db = require('../database');

// Save the selected language for the logged-in user
const saveLanguagePreference = (username, language) => {
  const query = 'INSERT INTO account (user_name, language) VALUES (?, ?) ON DUPLICATE KEY UPDATE language = VALUES(language)';
  db.query(query, [username, language], (error, results) => {
    if (error) {
      console.error('Error saving/updating language preference:', error);
    } else {
      // console.log('Language preference saved/updated successfully');
    }
  });
};

// Retrieve the selected language for the logged-in user
const getLanguagePreference = (username, callback) => {
    const query = 'SELECT language FROM account WHERE user_name = ?';
    db.query(query, [username], (error, results) => {
      if (error) {
        console.error('Error retrieving language preference:', error);
        callback(error, null);
      } else {
        const language = results[0] ? results[0].language : null;
        callback(null, language);
      }
    });
  };

  module.exports = {
    saveLanguagePreference,
    getLanguagePreference,
  }
