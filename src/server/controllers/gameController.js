console.log("gameController.js = Loaded");

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

    if (submittedAnswer === submittedQuestion) {
      const playerSocket = this.connectedSockets.get(this.socketId);
      if (playerSocket) {
        playerSocket.emit("answerResult", { correctAnswer: true });
      } else {
        console.error("Player socket not found");
      }
    } else if (submittedAnswer !== submittedQuestion) {
      const playerSocket = this.connectedSockets.get(this.socketId);
      if (playerSocket) {
        playerSocket.emit("answerResult", { correctAnswer: false });
      } else {
        console.error("Player socket not found");
      }
    }
  }

  progress(data) {
    // Retrieve stored data using the data storage module
    const lobbyData = dataStorage.retrieveData(); // Corrected variable name
    // Now you can access lobbyData in this function
    // console.log("Stored lobby data:", lobbyData);
    // console.log(data);
    const socketID = this.socketId;
    // console.log(socketID);
    const playerSocket = this.connectedSockets.get(socketID);
    const username = playerSocket.request.session.username;
    const questionIndex = parseInt(data.index, 10);

    if (data.pg == true) {
      try {
        if (!Array.isArray(lobbyData.players)) {
          // If the 'players' property is not an array, handle it here 
          console.error(
            "Invalid lobbyData format - 'players' is not an array:",
            lobbyData.players
          );
          return;
        } else {
          // Now you can safely loop through the 'players' array
          // console.log("Players in lobby", lobbyData.players, " <------------------------------"); 
          
          for (const playerData of lobbyData.players) {   
            // lobbyData.players.for((playerData) => {
            // lobbyData.players.for((playerData) => {
            if (playerData.id) {     // je moeder
              const playerSocketId = playerData.id;
              // Find the socket with the given playerSocketId from the map
              const playerSocket = this.connectedSockets.get(socketID);
              if (playerSocket) {
                // console.log('if playerSocket:', playerSocket);
                playerSocket.  broadcast.emit("userIndex", {
                  user: username,
                  index: questionIndex,
                });

                playerSocket.emit("persUserIndex", {
                  user: username,
                  index: questionIndex,
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
            // });
          }
        }
      } catch (error) {
        // console.log(error);
        // console.log("player not found");
        const playerSocket = this.connectedSockets.get(this.socketId);
        playerNotFoundError(playerSocket);
      }
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
