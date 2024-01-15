console.log('authController.js = Loaded');

const bcrypt = require("bcrypt");
const connection = require("../database.js");
const express = require("express");
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");

// Parse JSON request bodies
app.use(bodyParser.json());

const loginUser = (req, res) => {
  if (!req.body) {
    // console.log(req);
  }
  // Access the data sent from the client in req.body
  const username = req.body.username;
  const password = req.body.password;
  
  // Retrieve the hashed password from the database using the username or email
  connection.query(
    "SELECT user_pass FROM account WHERE user_name = ?",
    [username],
    function (error, results, fields) {
      if (error) {
        console.error(error);
        // Handle the database error (e.g., send an error response)
        res.json({ error: "login-failed" });
        res.end();
      } else if (results.length === 1) {
        // Compare the entered password with the hashed password
        const hashedPassword = results[0].user_pass;
        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (err) {
            console.error(err);
            // Handle the bcrypt error (e.g., send an error response)
            res.json({ error: "login-failed" });
            res.end();
          } else if (result === true) {
            // Passwords match, user is authenticated
            req.session.username = username;
            res.json({ success: "success" });
            res.end();
          } else {
            // Passwords do not match, authentication failed
            res.json({ error: "login-invalid" });
            res.end();
          }
        });
      } else {
        // No user with the given username or email found
        res.json({ error: "login-invalid" });
        res.end();
      }
    }
  );
};

const registerUser = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // First, check if the username already exists in the database
  connection.query(
    "SELECT COUNT(*) AS count FROM account WHERE user_name = ? OR email = ?",
    [username, email],
    (error, results, fields) => {
      if (error) {
        // Handle the database query error
        console.error(error);
        res.json({ error: "registration-failed" });
        res.end();
      } else {
        const usernameExists = results[0].count > 0;

        if (usernameExists) {
          // Username already exists, send an error response
          res.status(200).json({ error: "username-already-exists" });
          res.end();
        }

        // Hash the password before storing it in the database
        else
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              // Handle error (e.g., log it or send an error response)
              console.error(err);
              res.json({ error: "registration-failed-hashed" });
              res.end();
            } else {
              // Store the hashed password in the database
              connection.query(
                "INSERT INTO account (user_name, email, user_pass, language, difficulty) VALUES (?, ?, ?, ?, ?)",
                [username, email, hash, 'nl', 'niv1'], // Use the hash instead of the plain password
                function (error, results, fields) {
                  if (!error) {
                    // Registration successful
                    res.status(200).json({ success: "success" });
                    res.end();
                  } else {
                    // Handle other registration errors
                    console.error(error);
                    res.json({ error: "registration-failed-other" });
                    res.end();
                  }
                }
              );
            }
          });
      }
    }
  );
};

module.exports = {
  loginUser,
  registerUser,
};
