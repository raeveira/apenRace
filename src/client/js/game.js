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
    waitingGamePopup.style.display = "block";
    socket.emit("finished", {
      finish: true,
      score: score,
    });
    // submitButton.style.display = "none";
  }
}

// Function to check the user's answer
function checkAnswer() {
  const userAnswer = answerInput.value.trim() || 0;
  const currentQuestionAnswer = questions[currentQuestionIndex].answer;
  // console.log(userAnswer, currentQuestionAnswer)
  // console.log(score);
  // Send the user's answer to the server using sockets
  // console.log (currentQuestionIndex);
  socket.emit("submitAnswer", {
    question: currentQuestionAnswer,
    answer: userAnswer,
    progress: score,
  });
}

// Listen for the answer result from the server
socket.on("answerResult", (data) => {
  if (data.correctAnswer === true) {
    score = data.score;
    messageElement.textContent = "Correct! +1";
  } else if (data.correctAnswer === false) {
    score = data.score;
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

  socket.emit("progress", {
    pg: true,
    index: currentQuestionIndex,
    progress: score,
  });
});

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
  const userScores = {}; // Dictionary to store user scores

  // Listen for the "persoFinished" event
  socket.on("finished", (data) => {
    console.log("Your player has finished:", data.finished);
    waitingGamePopup.style.display = "none";
    finishedGamePopup.style.display = "block";
  });

  // Listen for the "top3Players" event
  socket.on("top3Players", (data) => {
    console.log("Received top3Players event", data);

    const top3Usernames = data.top3;

    // Create an array of colors corresponding to the top 3 players
    const colors = ["gold", "silver", "brown"];

    // Update the UI with colored usernames on separate lines with numbers
    const formattedTop3 = top3Usernames.map((username, index) => {
      const color = colors[index] || "white"; // Fallback to white if more than 3 players
      return `<div style="color:${color}">${index + 1}. ${username}</div>`;
    });

    document.getElementById(
      "top3Players"
    ).innerHTML = `Top 3 Players:<br><br>${formattedTop3.join("")}`;
  });

  socket.on("userIndex", (data) => {
    const gameScoreBoard = document.getElementById("gameScoreBoard");
    gameScoreBoard.style.display = "grid";
    const multiProfilePhoto = document.getElementById("multiProfilePhoto");
    multiProfilePhoto.style.display = "inline-block";
    const multiUserIndex = data.user;
    const progress = data.progress;
    const multiUserScoreIndex = data.index;
    let multiUserScore = userScores[multiUserIndex] || 0;
    multiUserScore++; // Increment the score as per your logic

    // Update the user score in the dictionary
    userScores[multiUserIndex] = multiUserScore;

    // Clear previous content in othersContainer
    document.getElementById("othersLeft").innerHTML = "";
    document.getElementById("othersRight").innerHTML = "";

    // Loop through the userScores dictionary and create a new row for each user
    for (const [username, score] of Object.entries(userScores)) {
      const usernameIndex = document.createElement("span");
      const usernameScore = document.createElement("span");
      const multiProfilePhoto = document.createElement("img");
      multiProfilePhoto.classList.add("profilePhoto");
      usernameIndex.classList.add("userIndex");
      usernameScore.classList.add("userScore");

      const totalScore = 20;
      const barHeight = 450;
      const correctedHeight = barHeight - 45;

      const profilePhotoPosition =
        (1 - multiUserScoreIndex / totalScore) * correctedHeight;
      multiProfilePhoto.style.top = profilePhotoPosition + "px";

      const altText = String(data.firstLetter);

      multiProfilePhoto.src = data.userPhoto;
      multiProfilePhoto.alt = altText;
      usernameScore.textContent = progress;
      usernameIndex.textContent = multiUserIndex;

      document.getElementById("othersLeft").appendChild(usernameScore);
      document.getElementById("othersLeft").appendChild(usernameIndex);

      document.getElementById("othersRight").appendChild(multiProfilePhoto);
    }
  });

  socket.on("persUserIndex", (data) => {
    const profilePhoto = document.getElementById("profilePhoto");
    profilePhoto.style.display = "inline-block";
    const altText = String(data.firstLetter);
    profilePhoto.alt = altText;
    const profilePhotoPath = data.userPhoto;
    personalUserIndex = data.user;
    personalUserScore = data.index;
    const personalUserProgress = data.progress;

    const gameScoreBoard = document.getElementById("gameScoreBoard");
    gameScoreBoard.style.display = "grid";
    const usernameIndex = document.getElementById("usernameIndex");
    const usernameScore = document.getElementById("usernameScore");
    const profilePhotoElement = document.getElementById("profilePhoto");

    const totalScore = 20;
    const barHeight = 450;
    const correctedHeight = barHeight - 45;

    const profilePhotoPosition =
      (1 - personalUserScore / totalScore) * correctedHeight;
    profilePhotoElement.style.top = profilePhotoPosition + "px";

    if (profilePhotoPath) {
      profilePhotoElement.src = profilePhotoPath;
      usernameIndex.textContent = personalUserIndex;
      usernameScore.textContent = personalUserProgress;
    }
  });
});
