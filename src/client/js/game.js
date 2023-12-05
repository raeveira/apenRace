let score = 0;
let bottomValue = 0;
let currentQuestionIndex = 0;
let questions = [];
let userDifficulty; // Add userDifficulty variable

var scoreImageElement = document.getElementById("scoreImage");

const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("questionDisplay");
const answerInput = document.getElementById("sumfield");
const submitButton = document.getElementById("submitButton");
const messageElement = document.getElementById("messageDisplay");
const scoreElement = document.getElementById("score"); // Add score element
const finishedGameCloseButton = document.getElementById(
  "finishedGameCloseButton"
);
const finishedGamePopup = document.getElementById("finishedGamePopup");

// Initialize the game state
function initializeGameState() {
  score = 0;
  currentQuestionIndex = 0;
  questions = [];
  userDifficulty = "";
  scoreElement.textContent = score;
  answerInput.value = "";
  messageElement.textContent = "";
}

// Load the user's selected difficulty and initialize the game state
function initGame() {
  initializeGameState();
  // Load the user's selected difficulty when the page loads
  fetch("/difficulty/get-difficulty")
    .then((response) => response.json())
    .then((data) => {
      userDifficulty = data.difficulty;
      if (userDifficulty) {
        fetchQuestions(userDifficulty);
      }
    });
}

function fetchQuestions(difficulty) {
  fetch(`/questions/${difficulty}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // console.log("Questions loaded:", data);
      questions = data;
      displayQuestion();
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
    });
}

// Display the current question
function displayQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answerInput.value = "";
    // submitButton.disabled = false; // Enable the submit button
  } else {
    // All questions answered
    questionElement.textContent = "";
    answerInput.style.display = "none";
    finishedGamePopup.style.display = "block";
    // submitButton.style.display = "none";

    if (score === 20) {
      let winPoint = 0;
      winPoint++;
      // console.log(winPoint);
      fetch("/leaderboard/save-leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wins: winPoint }),
      });
    }
  }
}

// Function to check the user's answer
function checkAnswer() {
  const userAnswer = answerInput.value.trim() || 0;
  const currentQuestionAnswer = questions[currentQuestionIndex].answer;
  // console.log(userAnswer, currentQuestionAnswer)
  // Send the user's answer to the server using sockets
  socket.emit("progress", {
    pg: true,
    index: currentQuestionIndex,
  });
  // console.log (currentQuestionIndex);
  socket.emit("submitAnswer", {
    question: currentQuestionAnswer,
    answer: userAnswer,
  });
}

// Initialize the game when the page loads
window.addEventListener("load", () => {
  // Initialize the game
  initGame();

  // Attach an event listener to handle Enter key press in the input field
  answerInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkAnswer();
    }
  });

  // Listen for the answer result from the server
  socket.on("answerResult", (data) => {
    if (data.correctAnswer === true) {
      score++;
      messageElement.textContent = "Correct! +1";
    } else if (data.correctAnswer === false) {
      score--;
      messageElement.textContent = "Incorrect! -1";
    } else {
      error.log("no data gotten: ", data);
    }

    setTimeout(() => {
      messageElement.textContent = "";
    }, 1000);

    document.getElementById("score").textContent = score;
    const maxBottomValue = 2;
    const imageMoveAmount = score * -200; // Adjust the value as needed

    if (imageMoveAmount < maxBottomValue) {
      scoreImageElement.style.bottom = imageMoveAmount + "px";
    }
    currentQuestionIndex += 1;
    displayQuestion(); // Display the next question after 1 second
  });

  // Listen for the "redirect" event from the server
  socket.on("redirect", (data) => {
    // Check if the data contains a destination property
    // console.log(data);
    if (data && data.destination) {
      // Perform the redirect using JavaScript
      window.location.href = data.destination;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // console.log("Client-side script executed");
  let personalUserIndex, personalUserScore;

  const othersContainer = document.getElementById("others");
  const userScores = {}; // Dictionary to store user scores

  socket.on("userIndex", (data) => {
    const multiUserIndex = data.user;
    let multiUserScore = userScores[multiUserIndex] || 0;
    multiUserScore++; // Increment the score as per your logic

    // Update the user score in the dictionary
    userScores[multiUserIndex] = multiUserScore;

    // Clear previous content in othersContainer
    othersContainer.innerHTML = "";

    // Loop through the userScores dictionary and create a new row for each user
    for (const [username, score] of Object.entries(userScores)) {
      const userRow = document.createElement("div");
      const usernameIndex = document.createElement("span");
      const usernameScore = document.createElement("span");

      usernameIndex.classList.add("multiUsernameIndex");
      usernameScore.classList.add("multiUsernameScore");

      usernameIndex.textContent = username;
      usernameScore.textContent = score;

      userRow.appendChild(usernameIndex);
      userRow.appendChild(usernameScore);

      othersContainer.appendChild(userRow);
    }
  });

  socket.on("persUserIndex", (data) => {
    // console.log("Progress event received:", data);
    //const { user, index } = user, index;
    // console.log("Username:", data.user);
    // console.log("Question Index:", data.index);
    const usernameIndex = document.getElementById("usernameIndex");
    const usernameScore = document.getElementById("usernameScore");

    personalUserIndex = data.user;
    personalUserScore = data.index;

    personalUserScore++;

    if (personalUserIndex) {
      usernameIndex.textContent = personalUserIndex;
      usernameScore.textContent = personalUserScore;
    }
  });
});
