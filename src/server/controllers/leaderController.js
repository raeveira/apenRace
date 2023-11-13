console.log("leaderboardController.js = Loaded");

const db = require("../database");

// Save the selected leaderboard for the logged-in user
const saveLeaderPreference = (username, leaderboard) => {
  // console.log(username, " : ", leaderboard);

  const getWins = "SELECT wins FROM leaderboard WHERE user_name = ?";
  db.query(getWins, [username], (error, results) => {
    if (error) {
      console.error("Error saving/updating leaderboard preference:", error);
    } else {
      if (results.length > 0) {
        const currentWins = results[0].wins; // Access the wins value from the first row
        // console.log("Current wins:", currentWins);

        // Convert currentWins to a number, and add leaderboard value
        const updatedWins = currentWins + parseInt(leaderboard);
        // console.log("Updated wins:", updatedWins);

        // Now you can update the wins in your database using an UPDATE query
        const updateQuery = "UPDATE leaderboard SET wins = ? WHERE user_name = ?";
        db.query(updateQuery, [updatedWins, username], (updateError, updateResults) => {
          if (updateError) {
            console.error("Error updating leaderboard wins:", updateError);
          } else {
            // console.log("Leaderboard wins updated successfully");
          }
        });
      } else {
        // console.log("User not found in leaderboard table");
        const addQuery = "INSERT INTO leaderboard (user_name, wins) VALUES (?, ?)"
        db.query(addQuery, [username, leaderboard], (error) => {
          if (error) {
            console.error('Error retrieving leaderboard insert:', error);
            callback(error, null);
          } else {
            // console.log("succesfully added", username, leaderboard);
          }
        });
      }
    }
  });
};

// Retrieve all data from the leaderboard table
const getLeaderboardData = (username, callback) => {
  const query = "SELECT * FROM leaderboard";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving leaderboard data:", error);
      callback(error, null);
    } else {
      // Send all the leaderboard data back to the client
      // console.log(results);
      const leaderboard = results;
      callback(null, leaderboard);
      // console.log("leaderboard: ", leaderboard);
    }
  });
};

module.exports = {
  saveLeaderPreference,
  getLeaderboardData,
};
