console.log('authRoute.js = Loaded');

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

// Define authentication routes
router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);

module.exports = router;
