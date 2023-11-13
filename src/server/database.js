const mysql = require("mysql");

// database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apen_race",
});

// connect to the database
connection.connect(function (error) {
  if (error) throw error;
  else console.log("connected to the database successfully!");
});

module.exports = connection;