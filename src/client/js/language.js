document.addEventListener("DOMContentLoaded", function () {
  const pageTitle = document.getElementById("pageTitle");
  const playButton = document.getElementById("playButton");
  const vote = document.getElementById("vote");
  const settingsButton = document.getElementById("settingsButton");
  const languageSelector = document.getElementById("languageSelector");
  const scoreboard = document.getElementById("scoreboard");
  const disconnectButton = document.getElementById("disconnectButton");
  const logout = document.getElementById("logout");
  const gameOptions = document.getElementById("gameOptions");
  const sound = document.getElementById("sound");
  const music = document.getElementById("music");
  const niv1 = document.getElementById("niv1");
  const niv2 = document.getElementById("niv2");
  const niv3 = document.getElementById("niv3");
  const niv4 = document.getElementById("niv4");
  const difficultyText = document.getElementById("difficultyText");
  const waitingPlayer = document.getElementById("waitingPlayer");
  const skipVotesText = document.getElementById("skipVotesText");
  const stayVotesText = document.getElementById("stayVotesText");
  const voteSkip = document.getElementById("voteSkip");
  const voteStay = document.getElementById("voteStay");
  const languageSelectorText = document.getElementById("languageSelectorText");
  const gameExplanation = document.getElementById("gameExplanation");
  const gameExplanation1 = document.getElementById("gameExplanation1");
  const gameExplanation2 = document.getElementById("gameExplanation2");
  const gameExplanation3 = document.getElementById("gameExplanation3");
  const leaderRank = document.getElementById("leaderRank");
  const globalLeaderboard = document.getElementById("globalLeaderboard");
  const closeLeaderboardButton = document.getElementById("closeLeaderboardButton");
  const leaderUsername = document.getElementById("leaderUsername");
  const leaderWins = document.getElementById("leaderWins");
  const chatInput = document.getElementById("input");
  const sumInput = document.getElementById("sumfield");
  const secret = document.getElementById("secret");

  let userLanguage; // Declare userLanguage variable outside of the fetch callback

  // console.log("Script loaded."); // Check if the script is loaded

  function loadLanguage(language) {
    // console.log(`Loading language: ${language}`);
    fetch(`src/server/languages/${language}.json`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("JSON data loaded:", data);
        if (pageTitle) {
          pageTitle.textContent = data.pageTitle;
        }
        if (playButton) {
          playButton.textContent = data.playButton;
        }
        if (vote) {
          vote.textContent = data.vote;
        }
        if (settingsButton) {
          settingsButton.textContent = data.settingsButton;
        }
        if (scoreboard) {
          scoreboard.textContent = data.scoreboard;
        }
        if (disconnectButton) {
          disconnectButton.textContent = data.disconnectButton;
        }
        if (logout) {
          logout.textContent = data.logout;
        }
        if (gameOptions) {
          gameOptions.textContent = data.gameOptions;
        }
        if (sound) {
          sound.textContent = data.sound;
        }
        if (music) {
          music.textContent = data.music;
        }
        if (niv1) {
          niv1.textContent = data.niv1;
        }
        if (niv2) {
          niv2.textContent = data.niv2;
        }
        if (niv3) {
          niv3.textContent = data.niv3;
        }
        if (niv4) {
          niv4.textContent = data.niv4;
        }
        if (difficultyText) {
          difficultyText.textContent = data.difficultyText;
        }
        if (waitingPlayer) {
          waitingPlayer.textContent = data.waitingPlayer;
        }
        if (skipVotesText) {
          skipVotesText.textContent = data.skipVotesText;
        }
        if (stayVotesText) {
          stayVotesText.textContent = data.stayVotesText;
        }
        if (voteSkip) {
          voteSkip.textContent = data.voteSkip;
        }
        if (voteStay) {
          voteStay.textContent = data.voteStay;
        }
        if (languageSelectorText) {
          languageSelectorText.textContent = data.languageSelectorText;
        }
        if (gameExplanation) {
          gameExplanation.textContent = data.gameExplanation;
        }
        if (gameExplanation1) {
          gameExplanation1.textContent = data.gameExplanation1;
        }
        if (gameExplanation2) {
          gameExplanation2.textContent = data.gameExplanation2;
        }
        if (gameExplanation3) {
          gameExplanation3.textContent = data.gameExplanation3;
        }
        if (globalLeaderboard) {
          globalLeaderboard.textContent = data.globalLeaderboard;
        }
        if (chatInput) {
          document.getElementsByName("chatInput")[0].placeholder =
            data.chatInput;
        }
        if (sumInput) {
          document.getElementsByName("sumInput")[0].placeholder = data.sumInput;
        }
        if (leaderRank) {
          leaderRank.textContent = data.leaderRank;
        }
        if (closeLeaderboardButton) {
          closeLeaderboardButton.textContent = data.closeLeaderboardButton;
        }
        if (leaderUsername) {
          leaderUsername.textContent = data.leaderUsername;
        }
        if (leaderWins) {
          leaderWins.textContent = data.leaderWins;
        }
        if (secret) {
          secret.textContent = data.secret;
        }
      })
      .catch((error) =>
        console.error(`Error loading /language/${language}: ${error}`)
      );
  }
  try {
    // Event listener for language selector change
    languageSelector.addEventListener("change", function () {
      const selectedLanguage = languageSelector.value;
      // console.log(`Selected language: ${selectedLanguage}`);
      loadLanguage(selectedLanguage);
    });
  } catch {
    ("halloe");
  }
  // Load the user's selected language when the page loads
  fetch("/language/get-language")
    .then((response) => response.json())
    .then((data) => {
      userLanguage = data.language; // Assign the selected language to userLanguage
      if (userLanguage) {
        try {
          languageSelector.value = userLanguage;
        } catch {
          ("HALLOE");
        }

        // console.log('User Language:', userLanguage);
        // Load the initial language set by user
        loadLanguage(userLanguage || "nl");
      }
    });
  try {
    // Save the selected language when the user changes it
    languageSelector.addEventListener("change", () => {
      const selectedLanguage = languageSelector.value;
      fetch("/language/save-language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: selectedLanguage }),
      });
    });
  } catch {
    ("halloeeeee");
  }
});
