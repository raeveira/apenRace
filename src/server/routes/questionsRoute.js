console.log('questionsRoute.js = Loaded');

const express = require('express');
const router = express.Router();

const questionsController = require('../controllers/questionsController');

// Define a route to load questions based on difficulty
router.get('/:difficulty', questionsController.loadQuestions);

module.exports = router;