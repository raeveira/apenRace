const cors = require("cors");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// console.log("PORT:", process.env.PORT);
const port = process.env.PORT || 3000;
const WaitingRoomManager = require("./controllers/waitingRoomController"); // Import the WaitingRoomManager class
const { GameManager } = require("./controllers/gameController");
// Create an instance of WaitingRoomManager
const waitingRoomManager = new WaitingRoomManager();
// Create a session store using express-session
const sessionMiddleware = session({
  secret: "your-secret-key", // Change this to a strong, random string
  resave: false,
  saveUninitialized: true,
});

app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);

// Serve static files
app.use("/public", express.static(path.resolve(__dirname, "../../public")));
app.use("/src", express.static(path.resolve(__dirname, "../../src")));
app.use("/js", express.static(path.resolve(__dirname, "../../src/client/js")));

// Define your routes here
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/index.html"));
});

// Import language routes and controller
const languageRoutes = require("./routes/languageRoute");
app.use("/language", languageRoutes);

// Import difficulty routes and controller
const difficultyRoutes = require("./routes/difficultyRoute");
app.use("/difficulty", difficultyRoutes);

// Import leaderboard routes and controller
const leaderRoutes = require("./routes/leaderRoute");
app.use("/leaderboard", leaderRoutes);

// Import waitingRoom routes and controller
const waitingRoomRoutes = require("./routes/waitingRoomRoute");
app.use("/waitingRoom", waitingRoomRoutes);

// Import auth routes and controller
const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes);

// Import auth routes and controller
const questionsRoute = require("./routes/questionsRoute");
app.use("/questions", questionsRoute);

const gameRoutes = require("./routes/gameRoute");
app.use("/game", gameRoutes);

// Serve language files from the 'languages' folder
app.get("/language/:lang", (req, res) => {
  const lang = req.params.lang;
  res.sendFile(path.resolve(__dirname, `../languages/${lang}.json`));
});

// Serve difficulty files from the 'difficulty' folder
app.get("/difficulty/:diff", (req, res) => {
  const diff = req.params.diff;
  res.sendFile(path.resolve(__dirname, `../server/questions/${diff}.json`));
});

app.get("/home", (req, res) => {
  // Check if the user is logged in
  if (req.session.username) {
    // Render the user's profile page with their username
    res.sendFile(path.resolve(__dirname, "../client/home.html"));
  } else {
    // Redirect to the login page or show an error message
    res.redirect("/");
  }
});

app.get("/game", (req, res) => {
  // Check if the user is logged in
  if (req.session.username) {
    // Render the user's profile page with their username
    res.sendFile(path.resolve(__dirname, "../client/game.html"));
  } else {
    // Redirect to the login page or show an error message
    res.redirect("/home");
  }
});

const playerNotFoundError = require('./controllers/gameController');

// Define a route that triggers the error
app.get('/trigger-error', (req, res) => {
  try {
    playerNotFoundError.playerNotFoundError();
  } catch (error) {
    // Handle the error and perform a redirect
    console.error('Error:', error);
    res.status(302).redirect('/home');
  }
});

io.use((socket, next) => {
  // Use the session middleware to initialize the session
  sessionMiddleware(socket.request, {}, next);
});

const connectedSockets = new Map();

io.on("connection", (socket) => {
  // console.log("Socket connected:", socket.id);

  connectedSockets.set(socket.id, socket);

  const gameManager = new GameManager(socket, io, connectedSockets);

  socket.on("lobbyData", (data) => {
    // console.log("Received lobbyData from client: ", data);
    gameManager.storeData(data);
  });

  socket.on("submitAnswer", (data) => {
    gameManager.submitAnswer(data, socket);
  });

  socket.on("finished", (data) => {
    const username = socket.request.session.username;
    gameManager.finished(username, data, socket);
  });

  socket.on("progress", (data) => {
    gameManager.progress(data, socket);
  });

  socket.on("voteSkip", (lobby) => {
    // console.log("Received voteSkip from client with lobby data:", lobby);
    waitingRoomManager.voteSkip(io, socket, lobby);
  });

  socket.on("voteStay", (lobby) => {
    // console.log("Received voteStay from client with lobby data:", lobby);
    waitingRoomManager.voteStay(io, socket, lobby);
  });

  // Handle a user joining the waiting room
  socket.on("joinWaitingRoom", (data) => {
    const lobby = data.lobby;
    const username = socket.request.session.username;
    socket.emit("joinedWaitingRoom", { username, lobby });

    waitingRoomManager.joinWaitingRoom(socket, io, username);
  });

  // Handle user disconnections
  socket.on("disconnect", () => {
    waitingRoomManager.handleDisconnect(socket, io);
  });

  // Handle user leaving queue
  socket.on("disconnectFromQueue", () => {
    waitingRoomManager.handleDisconnect(socket, io);
  });

  // Handle chat messages
  socket.on("chat message", (msg) => {
    // Get the username from the session
    const username = socket.request.session.username || "Anonymous";

    // Send the message with the format "username: message"
    const formattedMessage = `${username} : ${msg}`;
    io.emit("chat message", formattedMessage);
  });

  // Handle reconnection
  socket.on("reconnect", () => {
    // You can implement reconnection logic here if needed
    // For example, you can send the client a new serverTimestamp
    const serverTimestamp = Date.now();
    socket.emit("reconnected", { serverTimestamp });
  });
});
// logout
app.post("/logout", (req, res) => {
  // Destroy the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      // Handle logout error (if any)
      res.status(500).json({ error: "logout-failed" });
    } else {
      // Successful logout
      res.sendStatus(200);
    }
  });
});

// Start the server
http.listen(port, () => {
  console.log(`Apen Race server running at http://localhost:${port}/`);
});

// Export the app for testing or other use
module.exports = app;
