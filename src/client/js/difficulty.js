// const loadDifficulty= require("/difficulty/loadDifficulty");
document.addEventListener("DOMContentLoaded", function () {
  const difficultySelector = document.getElementById("difficultySelector");
  const selectedDifficulty = difficultySelector.value;
  let userDifficulty; // Declare userDifficulty variable outside of the fetch callback

  // console.log("Script loaded."); // Check if the script is loaded

  // Event listener for difficulty selector change
  difficultySelector.addEventListener("change", function () {
    const selectedDifficulty = difficultySelector.value;
    // console.log(`Selected difficulty: ${selectedDifficulty}`);
    loadDifficulty(selectedDifficulty);
  });

  // Save the selected difficulty when the user changes it
  difficultySelector.addEventListener("change", () => {
    const updatedDifficulty = difficultySelector.value;
    fetch("/difficulty/save-difficulty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ difficulty: updatedDifficulty }),
    });
  });

  // Load the user's selected difficulty when the page loads
  function fetchDifficulty() {
    fetch("/difficulty/get-difficulty")
      .then((response) => response.json())
      .then((data) => {
        userDifficulty = data.difficulty; // Assign the selected difficulty to userDifficulty
        if (userDifficulty) {
          difficultySelector.value = userDifficulty;
          // console.log("User difficulty:", userDifficulty);
          //Load the initial difficulty set by user
          loadDifficulty(userDifficulty || "easy");
        }
      });
  }

  function loadDifficulty(difficulty) {
    // console.log(`Loading difficulty: ${difficulty}`);
    fetch(`src/server/questions/${difficulty}.json`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("JSON data loaded:", data);
        questions = data;
      })
      .catch((error) =>
        console.error(`Error loading /difficulty/${difficulty}: ${error}`)
      );
  }

  // Call the fetchQuestions function to load questions when the page loads
  fetchDifficulty();
});
