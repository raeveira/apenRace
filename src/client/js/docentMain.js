function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");
  
    messageElement.textContent = message;
    messageElement.classList.remove(
      "form__message--success",
      "form__message--error"
    );
    messageElement.classList.add(`form__message--${type}`);
  }
  
  function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(
      ".form__input-error-message"
    ).textContent = message;
  }
  
  function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(
      ".form__input-error-message"
    ).textContent = "";
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".form__input").forEach((inputElement) => {
      inputElement.addEventListener("blur", (e) => {
        if (
          e.target.id === "signupUsername" &&
          e.target.value.length > 0 &&
          e.target.value.length < 3
        ) {
          setInputError(
            inputElement,
            "Username must be at least 3 characters in length"
          );
        } else if (
          e.target.id === "signupUsername" &&
          e.target.value.length > 16
        ) {
          setInputError(inputElement, "Max username length is 16 characters");
        }
      });
  
      inputElement.addEventListener("input", (e) => {
        clearInputError(inputElement);
      });
    });
  });
  
  if (document.getElementById("createAccount")) {
    document.querySelector("#createAccount").addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Get input values
      const fullname = document.getElementById("fullname").value;
      const username = document.getElementById("signupUsername").value;
      const klas = document.getElementById("signUpKlas").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const klasGetallen = ['1', '2', '3', '4', '5'];
  
      // Check if passwords match
      if (password !== confirmPassword) {
        setFormMessage(
          document.querySelector("#createAccount"),
          "error",
          "Wachtwoorden matchen niet."
        );
        return;
      }
  
      if (!klasGetallen.includes(klas)) {
        setFormMessage(
          document.querySelector("#createAccount"),
          "error",
          "Klas is niet een nummer, klas moet een nummer zijn bijvoorbeeld: voor de eerste klas '1' tweede klas '2' enc..",
        );
        return;
      }
  
      // Create an object to send as JSON
      const data = {
        fullname: fullname,
        username: username,
        email: email,
        password: password,
        klas: klas,
      };
  
      // Perform AJAX/Fetch registration
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/auth/register"); // Change the endpoint to /register
      // Set the request header for JSON data
      xhr.setRequestHeader("Content-Type", "application/json");
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // console.log(xhr.status);
          // console.log(xhr.responseText);
  
          // Parse the response JSON
          const response = JSON.parse(xhr.responseText);
  
          if (xhr.status === 200 && response.success === "success") {
            // Display an success message for user
            setFormMessage(
              document.querySelector("#createAccount"),
              "success",
              "Account has been successfully created"
            );
          } else if (
            xhr.status === 200 &&
            response.error === "username-already-exists"
          ) {
            // Display an error message for existing user
            setFormMessage(
              document.querySelector("#createAccount"),
              "error",
              "Username or email already exists."
            );
          } else {
            // Handle other registration errors
            setFormMessage(
              document.querySelector("#createAccount"),
              "error",
              "Registration failed."
            );
          }
        }
      };
  
      xhr.send(JSON.stringify(data));
    });
  }
  