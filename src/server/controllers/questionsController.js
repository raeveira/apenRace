const fs = require('fs');

// Limit the number of questions
const limitQuestions = 20;

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Load questions from JSON files
function loadQuestions(req, res) {
  const difficulty = req.params.difficulty;
  try {
    const rawQuestions = fs.readFileSync(`src/server/questions/${difficulty}.json`);
    const allQuestions = JSON.parse(rawQuestions);

    // Shuffle the array of questions
    shuffleArray(allQuestions);

    // Take a limited number of questions
    const limitedQuestions = allQuestions.slice(0, limitQuestions);

    res.json(limitedQuestions);
  } catch (error) {
    console.error("Error loading questions:", error);
    res.status(500).json({ error: 'Failed to load questions' });
  }
}

module.exports = {
  loadQuestions,
};
