console.log("gameController.js = Loaded");

const dataStorage = require("./dataStorage"); // Import the data storage module

class GameManager {
  constructor(socket, io, connectedSockets) {
    this.socket = socket;
    this.io = io;
    this.connectedSockets = connectedSockets;
  }

  // Function to store lobby data
  storeData(lobbyData) {
    dataStorage.storeData(lobbyData); // Use the data storage module to store data
  }

  submitAnswer(data) {
    const submittedAnswer = parseInt(data.answer, 10);
    const submittedQuestion = parseInt(data.question, 10);

    if (submittedAnswer === submittedQuestion) {
      this.socket.emit("answerResult", { correctAnswer: true });
    } else if (submittedAnswer !== submittedQuestion) {
      this.socket.emit("answerResult", { correctAnswer: false });
    }
  }

  progress(data) {
    // Retrieve stored data using the data storage module
    const lobbyData = dataStorage.retrieveData(); // Corrected variable name
    // Now you can access lobbyData in this function
    // console.log("Stored lobby data:", lobbyData);
// console.log(data);
    const username = this.socket.request.session.username;
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
          lobbyData.players.forEach((playerData) => {
            if (playerData.id) {
              const playerSocketId = playerData.id;

              console.log("playerData: ", playerData);

              // Find the socket with the given playerSocketId from the map
              const playerSocket = this.connectedSockets.get(playerSocketId);

              console.log("socket: ", playerSocket);

              if (playerSocket) {
                console.log("gotten here (line60 gc.js)");
                console.log("username: ", username);
                console.log("questionIndex: ", questionIndex);

                // this.playerSocket.emit("progress", { user: username, index: questionIndex, });
                playerSocket.emit("progress", {
                  user: username,
                  index: questionIndex,
                });

                console.log("Send successfull to client");
              } else {
                console.error("No socket found with id:", playerSocketId);
              }
            } else {
              console.error(
                "Player data does not contain an 'id' property:",
                playerData
              );
            }
          });
        }
      } catch(error) {
        console.log(error);
        // console.log("player not found");
        playerNotFoundError(this.socket);
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
