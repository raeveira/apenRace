// Get references to the button and the settingPopup div
const settingsButton = document.getElementById("settingsButton");
const settingsCloseButton = document.getElementById("settingsCloseButton");
const settingPopup = document.getElementById("settingPopup");

// Add a click event listener to the button
settingsButton.addEventListener("click", function () {
  // Toggle the visibility of the settingPopup div
  settingPopup.style.display = "block";
});

settingsCloseButton.addEventListener("click", function () {
  //Close the popup
  settingPopup.style.display = "none";
});
