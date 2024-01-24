console.log("gameController.js = Loaded");
const connection = require("../database.js");

class Klas {
  constructor(username) {
    this.username = username;
  }

  getClass(username) {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        SELECT klas1, klas2, klas3, klas4, klas5
        FROM account
        WHERE user_name = ?;
      `;

      connection.query(sqlQuery, [username], (error, results) => {
        if (error) {
          reject(error);
        } else {
          const userClasses = results[0]; // Assuming there's only one row for the user
          resolve(userClasses);
        }
      });
    });
  }

  getUsersInSameClass() {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        SELECT fullname, user_name, email, language, difficulty, permissions, klas1, klas2, klas3, klas4, klas5
        FROM account
        WHERE (klas1 = 1 OR klas2 = 1 OR klas3 = 1 OR klas4 = 1 OR klas5 = 1) AND permissions = 'leerling' AND user_name != ?;
      `;

      connection.query(sqlQuery, [this.username], (error, results) => {
        if (error) {
          reject(error);
        } else {
          const organizedUsers = {};

          results.forEach((user) => {
            // Iterate over each class and check if the user is in that class
            for (let i = 1; i <= 5; i++) {
              const klasColumn = `klas${i}`;
              if (user[klasColumn] === 1) {
                const klasName = `klas${i}`;
                if (!organizedUsers[klasName]) {
                  organizedUsers[klasName] = [];
                }
                organizedUsers[klasName].push(user);
                break; // Move to the next user once the class is found
              }
            }
          });
          resolve(organizedUsers);
        }
      });
    });
  }

  getDocent() {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        SELECT fullname, user_name, email, language, difficulty, permissions, klas1, klas2, klas3, klas4, klas5
        FROM account
        WHERE (klas1 = 1 OR klas2 = 1 OR klas3 = 1 OR klas4 = 1 OR klas5 = 1) AND permissions = 'docent' OR permissions = 'admin';
      `;

      connection.query(sqlQuery, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const organizedDocent = {};

          results.forEach((user) => {
            // Iterate over each class and check if the user is in that class
            for (let i = 1; i <= 5; i++) {
              const klasColumn = `klas${i}`;
              if (user[klasColumn] === 1 || user[klasColumn] === 0) {
                const klasName = `klas${i}`;
                if (!organizedDocent[klasName]) {
                  organizedDocent[klasName] = [];
                }
                organizedDocent[klasName].push(user);
                break; // Move to the next user once the class is found
              }
            }
          });

          resolve(organizedDocent);
        }
      });
    });
  }
}

module.exports = Klas;
