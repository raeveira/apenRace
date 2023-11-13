const fs = require('fs');

// Limit the number of the questions
const limitQuestions = 20;

// Load questions from JSON files
function loadQuestions(req, res) {
  const difficulty = req.params.difficulty;
  try {
    const rawQuestions = fs.readFileSync(`src/server/questions/${difficulty}.json`);
    const allQuestions = JSON.parse(rawQuestions);
    // console.log(rawQuestions, "OKEE" ,allQuestions)
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
