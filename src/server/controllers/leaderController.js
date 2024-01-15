console.log("leaderboardController.js = Loaded");

const db = require("../database");

// Save the selected leaderboard for the logged-in user
const saveLeaderPreference = (username, leaderboard) => {
  console.log(username, " : ", leaderboard);

  // Check if the user exists in the account table
  const checkUserQuery = "SELECT * FROM account WHERE user_name = ?";
  db.query(checkUserQuery, [username], (checkUserError, userResults) => {
    if (checkUserError) {
      console.error("Error checking if the user exists:", checkUserError);
    } else {
      if (userResults.length > 0) {
        // User exists, proceed with updating or inserting into the leaderboard
        const getWinsQuery = "SELECT wins FROM leaderboard WHERE user_name = ?";
        db.query(getWinsQuery, [username], (error, results) => {
          if (error) {
            console.error("Error saving/updating leaderboard preference:", error);
          } else {
            if (results.length > 0) {
              const currentWins = results[0].wins;
              const updatedWins = currentWins + parseInt(leaderboard);
              const updateQuery = "UPDATE leaderboard SET wins = ? WHERE user_name = ?";
              db.query(updateQuery, [updatedWins, username], (updateError, updateResults) => {
                if (updateError) {
                  console.error("Error updating leaderboard wins:", updateError);
                } else {
                  console.log("Leaderboard wins updated successfully");
                }
              });
            } else {
              // User not found in leaderboard table, insert a new row
              const addQuery = "INSERT INTO leaderboard (user_name, wins) VALUES (?, ?)";
              db.query(addQuery, [username, leaderboard], (addError) => {
                if (addError) {
                  console.error('Error retrieving leaderboard insert:', addError);
                } else {
                  console.log("Successfully added to the leaderboard:", username, leaderboard);
                }
              });
            }
          }
        });
      } else {
        // User does not exist in the account table
        console.error("User does not exist:", username);
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
