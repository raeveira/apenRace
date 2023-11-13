// Variable to store the data
let storedData = null;

// Function to store data
function storeData(data) {
  storedData = data;
}

// Function to retrieve data
function retrieveData() {
  return storedData;
}

module.exports = { storeData, retrieveData };
