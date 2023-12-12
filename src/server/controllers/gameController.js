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
    // console.log(lobbyData);
    dataStorage.storeData(lobbyData); // Use the data storage module to store data
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

        // Now you can use the profilePhoto in the rest of your code

        if (!Array.isArray(lobbyData.players)) {
          console.error(
            "Invalid lobbyData format - 'players' is not an array:",
            lobbyData.players
          );
          return;
        } else {
          for (const playerData of lobbyData.players) {
            if (playerData.id) {
              const playerSocketId = playerData.id;
              const playerSocket = this.connectedSockets.get(socketID);
              if (playerSocket) {
                playerSocket.broadcast.emit("userIndex", {
                  userPhoto: profilePhoto,
                  user: username,
                  index: questionIndex,
                  progress: progress,
                });

                playerSocket.emit("persUserIndex", {
                  userPhoto: profilePhoto,
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
