console.log("gameController.js = Loaded");
const connection = require("../database.js");

const dataStorage = require("./dataStorage"); // Import the data storage module

class GameManager {
  constructor(playerData, io, connectedSockets) {
    this.socketId = playerData.id;
    this.io = io;
    this.connectedSockets = connectedSockets;
  }

  // Function to store lobby data
  storeData(lobbyData) {
    // Use the data storage module to store data
    dataStorage.storeData(lobbyData);
  }

  submitAnswer(data) {
    const submittedAnswer = parseInt(data.answer, 10);
    const submittedQuestion = parseInt(data.question, 10);
    let progress = data.progress;

    if (submittedAnswer === submittedQuestion) {
      progress++;
      const playerSocket = this.connectedSockets.get(this.socketId);
      if (playerSocket) {
        playerSocket.emit("answerResult", {
          correctAnswer: true,
          score: progress,
        });
      } else {
        console.error("Player socket not found");
      }
    } else if (submittedAnswer !== submittedQuestion) {
      progress--;
      const playerSocket = this.connectedSockets.get(this.socketId);
      if (playerSocket) {
        playerSocket.emit("answerResult", {
          correctAnswer: false,
          score: progress,
        });
      } else {
        console.error("Player socket not found");
      }
    }
  }

  async getProfilePhoto(username) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT `profilePhoto` FROM `account` WHERE `user_name` = ?";

      connection.query(query, [username], (error, results) => {
        if (error) {
          console.error("Error executing query", error);
          reject(error);
        } else {
          let profilePhoto =
            results.length > 0 ? results[0].profilePhoto : null;

          if (!profilePhoto) {
            profilePhoto = "/public/userPhotos/default.png";
          }
          // console.log("Profile Photo:", profilePhoto);
          resolve(profilePhoto);
        }
      });
    });
  }

  async finished(username, data) {
    const lobbyData = dataStorage.retrieveData();
    console.log(lobbyData);
    console.log("score: ", data.score);

    if (Array.isArray(lobbyData.players)) {
      console.log("Searching for user:", username);
      console.log(
        "Usernames in lobbyData:",
        lobbyData.players.map((user) => user.username)
      );

      const userToUpdate = lobbyData.players.find(
        (user) => user.username === username
      );

      if (userToUpdate) {
        // Update the 'finished' property if it exists, or create it if not
        userToUpdate.finished = data.finish;
        userToUpdate.score = data.score;

        // Check if every user has finished
        const allUsersFinished = lobbyData.players.every(
          (user) => user.finished
        );

        if (allUsersFinished) {
          // Sort players based on the score in descending order
          const sortedPlayers = lobbyData.players.sort(
            (a, b) => b.score - a.score
          );
          console.log("sortedplayers:", sortedPlayers);
          // Extract the top 3 players
          const top3Players = sortedPlayers.slice(
            0,
            Math.min(sortedPlayers.length, 3)
          );
          console.log("top3players; ", top3Players);

          // Emit top3Players event to all connected sockets
          const top3Usernames = top3Players.map((player) => player.username);

          // Ensure top3Usernames always has three usernames
          while (top3Usernames.length < 3) {
            top3Usernames.push("NaN");
            top3Usernames.push("NaN");
          }
          let winPoint = 0;
          let topUsername;
          console.log("top3Usernames:", top3Usernames);
          // Assign points based on position (1st, 2nd, 3rd)
          for (let index = 0; index < 3; index++) {
            switch (index) {
              case 0:
                winPoint = 3;
                break;
              case 1:
                winPoint = 2;
                break;
              case 2:
                winPoint = 1;
                break;
              default:
                winPoint = 0;
                break;
            }

            console.log("username:", top3Usernames[index], "wins:", winPoint);
            try {
              topUsername = top3Usernames[index];
              console.log(topUsername);
              const response = await fetch("http://localhost:3000/leaderboard/save-leaderboard", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: topUsername,
                  wins: winPoint,
                }),
              });
            
              // Check if the response has a JSON content type
              const contentType = response.headers.get("content-type");
            
              if (contentType && contentType.includes("application/json")) {
                const responseData = await response.json();
                console.log(
                  `Points updated successfully for ${top3Usernames[index]}. New points: ${responseData.wins}`
                );
              } else {
                // Handle non-JSON response (e.g., plain text)
                const responseText = await response.text();
                console.log(`Non-JSON response: ${responseText}`);
            
                // You can add custom logic to handle plain text responses here
              }
            } catch (error) {
              console.error(`Error updating points for ${top3Usernames[index]}:`, error);
            }
          }

          this.connectedSockets.forEach(socket => {
            socket.emit("top3Players", { top3: top3Usernames });
          });
          this.connectedSockets.forEach((socket) => {
            socket.emit("finished", { finished: true });
          });
        }
        // Save the updated lobbyData
        dataStorage.storeData(lobbyData);
      } else {
        console.error("User not found in lobbyData:", username);
      }
    } else {
      console.error("Invalid lobbyData format:", lobbyData);
    }
  }

  async progress(data) {
    try {
      let progress = data.progress;
      const lobbyData = dataStorage.retrieveData();
      const socketID = this.socketId;
      const playerSocket = this.connectedSockets.get(socketID);
      const username = playerSocket.request.session.username;
      const questionIndex = parseInt(data.index, 10);

      if (data.pg == true) {
        // Retrieve profile photo using the asynchronous getProfilePhoto function
        const profilePhoto = await this.getProfilePhoto(username);
        const firstLetter = username.charAt(0).toUpperCase();

        if (!Array.isArray(lobbyData.players)) {
          console.error(
            "Invalid lobbyData format - 'players' is not an array:",
            lobbyData.players
          );
          console.log(lobbyData);
          return;
        } else {
          for (const playerData of lobbyData.players) {
            if (playerData.id) {
              const playerSocketId = playerData.id;
              const playerSocket = this.connectedSockets.get(socketID);
              if (playerSocket) {
                playerSocket.broadcast.emit("userIndex", {
                  userPhoto: profilePhoto,
                  firstLetter: firstLetter,
                  user: username,
                  index: questionIndex,
                  progress: progress,
                });

                playerSocket.emit("persUserIndex", {
                  userPhoto: profilePhoto,
                  firstLetter: firstLetter,
                  user: username,
                  index: questionIndex,
                  progress: progress,
                });
                break;
              } else {
                console.error("No socket found with id:", playerSocketId);
              }
            } else {
              console.error(
                "Player data does not contain an 'id' property:",
                playerData
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("An error occurred in the progress function", error);
      const playerSocket = this.connectedSockets.get(this.socketId);
      playerNotFoundError(playerSocket);
    }
  }
}
function playerNotFoundError(socket) {
  // Redirect the player to the '/' route
  console.error("Player is not found");
  socket.emit("redirect", { destination: "/home" });
  // console.log("player succesfully sent back");
}

module.exports = {
  GameManager,
  playerNotFoundError,
};
