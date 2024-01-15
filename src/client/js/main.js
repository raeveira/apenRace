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
  const loginform = document.querySelector("#login");
  const createAccountForm = document.querySelector("#createAccount");

  document
    .querySelector("#linkCreateAccount")
    .addEventListener("click", (e) => {
      e.preventDefault();
      loginform.classList.add("form--hidden");
      createAccountForm.classList.remove("form--hidden");
    });

  document.querySelector("#linkLogin")
    .addEventListener("click", (e) => {
    e.preventDefault();
    loginform.classList.remove("form--hidden");
    createAccountForm.classList.add("form--hidden");
  });

  document
  .querySelector("#kmd_DocentInloggen")
  .addEventListener('click', (e) => {
    e.preventDefault();
    //loginformAdmin.classList.add("form--hidden");
    loginformDocent.classList.remove("form--hidden");
    keuzeMenu.classList.add("form--hidden");
  });
  
  document
  .querySelector("#kmd_AdminInloggen")
  .addEventListener('click', (e) => {
    e.preventDefault();
    loginformAdmin.classList.remove("form--hidden");
    loginformDocent.classList.add("form--hidden");
    keuzeMenu.classList.add("form--hidden");
  });
 try {
  //===========================Login Docent==========================\\
  loginformDocent.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementsByName("usernameDocent")[0].value;
      const password = document.getElementById("docentenWachtwoord").value;

      // Create an object to send as JSON
      let data = {
        username: username,
        password: password,
      };

      // Perform AJAX/Fetch login
   

      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/auth/loginDocent");
      // set the request header for JSON data
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // console.log(xhr.status);
          // console.log(xhr.responseText);

          // Parse the response JSON
          const response = JSON.parse(xhr.responseText);

          if (xhr.status === 200 && response.success === "success") {
            // Redirect the user to the home page
            window.location.href = "/docent"; // Change this URL to your desired redirection URL
            console.log("ik ben hier gekomen");
            console.log(xhr.status);
          }
          if (xhr.status === 200 && response.error === "login-invalid") {
            // Redirect the user to the home page
            window.location.href = "/"; // Change this URL to your desired redirection URL
            console.log("verkeerd wachtwoord");
            console.log(xhr.status);
            console.log(xhr.response);
            //error message not logged in.
          }
        }
      };

      xhr.send(JSON.stringify(data));
    });
}

  catch(err) {
    console.log(err);
  }

  //============================Login Admin==========================\\
  loginformAdmin.addEventListener("submit", (e) => { 
    e.preventDefault();
    let username = document.getElementsByName("username")[0].value;
    let password = document.getElementsByName("password")[0].value;

    // Create an object to send as JSON
    let data = {
      username: username,
      password: password,
    };

    // Perform AJAX/Fetch login
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/auth/login");
    // set the request header for JSON data
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // console.log(xhr.status);
        // console.log(xhr.responseText);

        // Parse the response JSON
        const response = JSON.parse(xhr.responseText);

        if (xhr.status === 200 && response.success === "success") {
          // Redirect the user to the home page
          window.location.href = "/home"; // Change this URL to your desired redirection URL
        }
        if (xhr.status === 200 && response.error === "login-invalid") {
          // Redirect the user to the home page
          window.location.href = "/"; // Change this URL to your desired redirection URL
          //error message not logged in.
        }
      }
    };

    xhr.send(JSON.stringify(data));
  });
  
  //==============================login User==========================\\
  loginform.addEventListener("submit", (e) => {
    e.preventDefault();
    let username = document.getElementsByName("username")[0].value;
    let password = document.getElementsByName("password")[0].value;

    // Create an object to send as JSON
    let data = {
      username: username,
      password: password,
    };

    // Perform AJAX/Fetch login
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/auth/login");
    // set the request header for JSON data
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // console.log(xhr.status);
        // console.log(xhr.responseText);

        // Parse the response JSON
        const response = JSON.parse(xhr.responseText);

        if (xhr.status === 200 && response.success === "success") {
          // Redirect the user to the home page
          window.location.href = "/home"; // Change this URL to your desired redirection URL
        }
        if (xhr.status === 200 && response.error === "login-invalid") {
          // Redirect the user to the home page
          window.location.href = "/"; // Change this URL to your desired redirection URL
          //error message not logged in.
        }
      }
    };

    xhr.send(JSON.stringify(data));
  });

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

document.querySelector("#createAccount").addEventListener("submit", (e) => {
  e.preventDefault();

  // Get input values
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Check if passwords match
  if (password !== confirmPassword) {
    setFormMessage(
      document.querySelector("#createAccount"),
      "error",
      "Passwords do not match."
    );
    return;
  }

  // Create an object to send as JSON
  const data = {
    username: username,
    email: email,
    password: password,
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
