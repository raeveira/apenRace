// logout
document.addEventListener("DOMContentLoaded", () => {
    // Add an event listener for the logout button
    document
      .querySelector(".logout-button")
      .addEventListener("click", () => {
        // Perform AJAX/Fetch request to log out
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/logout"); // Create a new route for logout if needed
        xhr.setRequestHeader("Content-Type", "application/json");
  
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // Redirect the user to the login page after successful logout
              window.location.href = "/";
            } else {
              // Handle logout error (if any)
              console.error(
                "Logout error:",
                xhr.status,
                xhr.responseText
              );
            }
          }
        };
  
        xhr.send();
      });
  });