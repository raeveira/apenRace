console.log('waitingRoomRoute.js = Loaded');

const express = require('express');
const router = express.Router();
const { WaitingRoomManager } = require('../controllers/waitingRoomController.js');

// Define waiting room routes
router.post('/join', (req, res) => {
  // Handle user joining the waiting room
  const socket = req.app.get('socketIO'); // Get the socket.io instance from your app
  const username = socket.request.session.username;
  WaitingRoomManager.joinWaitingRoom(socket, io, username);
  res.status(200).send('Joined waiting room');
});

// Handle user disconnections
router.post('/disconnect', (req, res) => {
  // Handle user disconnecting from the waiting room
  const socket = req.app.get('socketIO'); // Get the socket.io instance from your app
  WaitingRoomManager.handleDisconnect(socket);
  res.status(200).send('Disconnected from waiting room');
});

module.exports = router;
