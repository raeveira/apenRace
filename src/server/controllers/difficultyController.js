console.log('difficultyController.js = Loaded');

// const { set } = require('..');
const db = require('../database');

// Save the selected difficulty for the logged-in user
const saveDifficultyPreference = (username, difficulty) => {
  // console.log(username, " : ", difficulty);
  const query = 'INSERT INTO account (user_name, difficulty) VALUES (?, ?) ON DUPLICATE KEY UPDATE difficulty = VALUES(difficulty)';
  db.query(query, [username, difficulty], (error, results) => {
    if (error) {
      console.error('Error saving/updating difficulty preference:', error);
    } else {
      // console.log('difficulty preference saved/updated successfully');
    }
  });
};

// Retrieve the selected difficulty for the logged-in user
const getDifficultyPreference = (username, callback) => {
    const query = 'SELECT difficulty FROM account WHERE user_name = ?';
    db.query(query, [username], (error, results) => {
      if (error) {
        console.error('Error retrieving difficulty preference:', error);
        callback(error, null);
      } else {
        const difficulty = results[0] ? results[0].difficulty : null;
        callback(null, difficulty);
        // console.log("difficulty current player:", difficulty);
      }
    });
  };

  module.exports = {
    saveDifficultyPreference,
    getDifficultyPreference,
  }
