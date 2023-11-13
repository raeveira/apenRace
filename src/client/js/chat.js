var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

// Function to reset the chat to visible
function resetChatVisibility() {
  var chat = document.querySelector(".chat");
  chat.classList.remove("inactive");
}

// Function to start the timeout and hide the chat after 5 seconds of inactivity
function startChatTimeout() {
  timeout = setTimeout(function () {
    var chat = document.querySelector(".chat");
    chat.classList.add("inactive");
  }, 7500); // 7500 milliseconds (7.5 seconds)
}

// Event listeners for mouse events on the chat div
var chatDiv = document.querySelector(".chat");
chatDiv.addEventListener("mouseover", resetChatVisibility);
chatDiv.addEventListener("mouseout", startChatTimeout);

// Initialize the timeout when the page loads
startChatTimeout();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    clearTimeout(timeout); // Clear the timeout
    resetChatVisibility(); // Reset chat visibility
    socket.emit("chat message", input.value);
    input.value = "";

    // Introduce a 3-second delay before restarting the timeout
    setTimeout(function () {
      startChatTimeout(); // Restart the timeout after 3 seconds
    }, 3000);
  }
});

socket.on("chat message", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  const out = document.getElementById("chat");
  out.scrollTop = out.scrollHeight - out.clientHeight;
});
