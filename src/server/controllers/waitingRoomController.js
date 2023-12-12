console.log("waitingRoomController.js = Loaded");

const MAX_PLAYERS = 10;
const WAITING_ROOM_TIMEOUT = .1 * 60 * 1000; // 5 minutes in milliseconds

class WaitingRoomManager {
  constructor() {
    this.lobbies = {}; // Object to store multiple lobbies
    this.lobbyIdCounter = 0;
    this.socketIdToPlayer = {}; // Map of socket IDs to player information
  }

  createNewLobby() {
    const lobbyId = this.lobbyIdCounter++;
    return {
      id: lobbyId,
      players: [],
      timer: null,
      startTime: null,
      remainingTime: WAITING_ROOM_TIMEOUT,
      skipVotes: new Map(),
      stayVotes: new Map(),
    };
  }

  startWaitingRoomTimer(lobby, io) {
    if (!lobby.timer) {
      lobby.startTime = Date.now(); // Record the start time when the timer begins

      const updateInterval = 1000; // Update the timer every second (or adjust as needed)

      const updateTimer = () => {
        const elapsedTime = Date.now() - lobby.startTime; // Calculate elapsed time for this lobby
        lobby.remainingTime = WAITING_ROOM_TIMEOUT - elapsedTime; // Update remaining time

        if (lobby.remainingTime <= 0) {
          clearInterval(lobby.timer);
          io.to(lobby.players.map((player) => player.id)).emit("startGame");
        } else {
          io.to(lobby.players.map((player) => player.id)).emit(
            "waitingRoomStatus",
            {
              playerCount: lobby.players.length,
              remainingTime: lobby.remainingTime,
              isFull: lobby.players.length === MAX_PLAYERS,
              usernames: lobby.players.map((player) => player.username),
              serverTimestamp: lobby.startTime,
              source: "timer", // Add a source property to differentiate this event
            }
          );
          // Schedule the next update
          lobby.timer = setTimeout(updateTimer, updateInterval);
        }
      };
      // Start the initial timer immediately
      updateTimer();
    }
  }

  joinWaitingRoom(socket, io, username) {
    let lobbyToJoin = null;
    let skipVotesI = 0;
    let stayVotesI = 0;

    // Find an available lobby or create a new one
    for (const lobbyId in this.lobbies) {
      if (this.lobbies.hasOwnProperty(lobbyId)) {
        const lobby = this.lobbies[lobbyId];
        if (lobby.players.length < MAX_PLAYERS) {
          lobbyToJoin = lobby;
          break;
        }
      }
    }

    if (!lobbyToJoin) {
      lobbyToJoin = this.createNewLobby();
      this.lobbies[lobbyToJoin.id] = lobbyToJoin;
      // console.log(lobbyToJoin);
    }

    function ObjectLengthII(object) {
      var length = 0;
      for (let key of object) {
        // if( object.hasOwnProperty(key) ) {
        length++;
        //}
      }
      return length;
    }

    skipVotesI = ObjectLengthII(lobbyToJoin.skipVotes);
    stayVotesI = ObjectLengthII(lobbyToJoin.stayVotes);

    lobbyToJoin.players.push({ id: socket.id, username }); // Store the username
    // console.log(socket.id)
    socket.emit("joinedWaitingRoom", { username });

    // Start or resume the timer for the lobby
    this.startWaitingRoomTimer(lobbyToJoin, io);

    // Emit both sets of vote counts (skipVotes and stayVotes) to the player
    socket.emit("updateVotes", {
      skipVotes: skipVotesI,
      stayVotes: stayVotesI,
      playerCount: lobbyToJoin.players.length,
      votingType: "initial", // You can use an initial type to differentiate this from other updates
    });

    // Emit an update event to all players in the lobby with the new player count
    io.to(lobbyToJoin.players.map((player) => player.id)).emit(
      "waitingRoomStatus",
      {
        playerCount: lobbyToJoin.players.length,
        remainingTime: lobbyToJoin.remainingTime,
        isFull: lobbyToJoin.players.length === MAX_PLAYERS,
        usernames: lobbyToJoin.players.map((player) => player.username),
        serverTimestamp: lobbyToJoin.startTime,
        source: "playerJoin", // Add a source property to differentiate this event
      }
    );
    socket.emit("lobbyData", {
      lobbyId: lobbyToJoin.id,
      players: lobbyToJoin.players,
    });
  }

  handleDisconnect(socket, io) {
    for (const lobbyId in this.lobbies) {
      if (this.lobbies.hasOwnProperty(lobbyId)) {
        const lobby = this.lobbies[lobbyId];
        const index = lobby.players.findIndex(
          (player) => player.id === socket.id
        );
        if (index !== -1) {
          // Remove the player from the lobby
          lobby.players.splice(index, 1);

          // Clear the player's votes using their socket ID
          lobby.skipVotes.delete(socket.id);
          lobby.stayVotes.delete(socket.id);

          // Emit an update event to all players in the lobby with the new vote counts
          const totalSkipVotes = Array.from(lobby.skipVotes.values()).reduce(
            (acc, count) => acc + count,
            0
          );
          const totalStayVotes = Array.from(lobby.stayVotes.values()).reduce(
            (acc, count) => acc + count,
            0
          );
          io.to(lobby.players.map((player) => player.id)).emit("updateVotes", {
            skipVotes: totalSkipVotes,
            stayVotes: totalStayVotes,
            playerCount: lobby.players.length,
          });

          // Check if the lobby is empty
          if (lobby.players.length === 0) {
            // Reset the timer and void all votes
            clearInterval(lobby.timer);
            lobby.timer = null;
            lobby.remainingTime = WAITING_ROOM_TIMEOUT;
            lobby.startTime = null;
            lobby.skipVotes.clear();
            lobby.stayVotes.clear();

            socket.emit("updateVotes", {
              skipVotes: 0,
              stayVotes: 0,
              source: "noPlayers",
            });
          }
          break;
        }
      }
    }
  }

  voteSkip(io, socket) {
    // Find the lobby that the player is in
    let lobby = null;
    let stayVotesI = 0;
    let skipVotesI = 0;

    for (const lobbyId in this.lobbies) {
      if (this.lobbies.hasOwnProperty(lobbyId)) {
        const currentLobby = this.lobbies[lobbyId];
        if (currentLobby.players.some((player) => player.id === socket.id)) {
          lobby = currentLobby;
          break;
        }
      }
    }

    if (lobby) {
      // Initialize the vote count if it doesn't exist for this player in this lobby
      if (!lobby.skipVotes.has(socket.id)) {
        lobby.skipVotes.set(socket.id, 0);
      }

      function ObjectLength(object) {
        var length = 0;
        for (let key of object) {
          // if( object.hasOwnProperty(key) ) {
          length++;
          //}
        }
        return length;
      }

      // Increase skip votes for this player in this lobby
      lobby.skipVotes.set(socket.id, lobby.skipVotes.get(socket.id) + 1);

      skipVotesI = ObjectLength(lobby.skipVotes);

      stayVotesI = ObjectLength(lobby.stayVotes);

      // Emit an update event with the skipVotes map for this lobby
      io.to(lobby.players.map((player) => player.id)).emit("updateVotes", {
        skipVotes: skipVotesI,
        stayVotes: stayVotesI,
        playerCount: lobby.players.length,
        votingType: "skip",
      });

      // console.log(`Player ${socket.id} voted to skip in Lobby ${lobby.id}.`);

      // Check if more than half of the players voted to skip
      if (skipVotesI > lobby.players.length / 2) {
        // Set the remaining time to 5 seconds
        lobby.remainingTime = 5000; // 5 seconds in milliseconds
        // Clear the existing timer and start a new one
        clearInterval(lobby.timer);

        // Create a function to periodically update the countdown and emit the event
        const updateCountdownAndEmit = () => {
          // Update the countdown
          lobby.remainingTime -= 1000; // Subtract 1 second (1000 milliseconds) from the remaining time

          // Emit the updated waiting room status to all players in the lobby

          //TODO remove Buttons after countdown is initialized.
          io.to(lobby.players.map((player) => player.id)).emit(
            "waitingRoomStatus",
            {
              playerCount: lobby.players.length,
              remainingTime: lobby.remainingTime,
              isFull: lobby.players.length === MAX_PLAYERS,
              usernames: lobby.players.map((player) => player.username),
              serverTimestamp: lobby.startTime,
              source: "timer",
              votingType: "skipSuccess",
            }
          );

          io.to(lobby.players.map((player) => player.id)).emit("updateVotes", {
            skipVotes: skipVotesI,
            stayVotes: stayVotesI,
            playerCount: lobby.players.length,
            remainingTime: lobby.remainingTime,
            source: "timer",
            votingType: "skipSuccess",
          });

          if (lobby.remainingTime <= 0) {
            // Stop the loop when the countdown reaches 0
            clearInterval(countdownInterval);
            io.to(lobby.players.map((player) => player.id)).emit("startGame");
          }
        };

        // Start the initial countdown
        updateCountdownAndEmit();

        // Set up a recurring interval to update the countdown and emit the event
        const countdownInterval = setInterval(updateCountdownAndEmit, 1000); // Update every second (1000 milliseconds)
      }
    }
  }

  voteStay(io, socket) {
    // Find the lobby that the player is in
    let lobby = null;
    let stayVotesI = 0;
    let skipVotesI = 0;

    for (const lobbyId in this.lobbies) {
      if (this.lobbies.hasOwnProperty(lobbyId)) {
        const currentLobby = this.lobbies[lobbyId];
        if (currentLobby.players.some((player) => player.id === socket.id)) {
          lobby = currentLobby;
          break;
        }
      }
    }

    if (lobby) {
      // Initialize the vote count if it doesn't exist for this player in this lobby
      if (!lobby.stayVotes.has(socket.id)) {
        lobby.stayVotes.set(socket.id, 0);
      }

      function ObjectLengthI(object) {
        var length = 0;
        for (let key of object) {
          // if( object.hasOwnProperty(key) ) {
          length++;
          //}
        }
        return length;
      }

      // Increase stay votes for this player in this lobby
      lobby.stayVotes.set(socket.id, lobby.stayVotes.get(socket.id) + 1);

      skipVotesI = ObjectLengthI(lobby.skipVotes);

      stayVotesI = ObjectLengthI(lobby.stayVotes);

      // Emit an update event with the stayVotes map for this lobby
      io.to(lobby.players.map((player) => player.id)).emit("updateVotes", {
        skipVotes: skipVotesI,
        stayVotes: stayVotesI,
        playerCount: lobby.players.length,
        votingType: "stay",
      });

      // console.log(`Player ${socket.id} voted to stay in Lobby ${lobby.id}.`);
    }
  }
}

module.exports = WaitingRoomManager;
