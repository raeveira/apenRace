const express = require("express");
const router = express.Router();
const { gameManager } = require('../controllers/gameController');

// Define waiting room routes
router.post('/submit-answer', (req, res) => {
  // Handle user joining the waiting room
  const socket = req.app.get('socketIO'); // Get the socket.io instance from your app
  const username = socket.request.session.username;
  gameManager.submitAnswer(socket, io, username);
  res.status(200).send('ok');
});

router.post('/progress', (req, res) => {
  // Handle user joining the waiting room
  const socket = req.app.get('socketIO'); // Get the socket.io instance from your app
  const username = socket.request.session.username;
  gameManager.progress(socket, io, username);
  res.status(200).send('ok');
});

module.exports = router;
