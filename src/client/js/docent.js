var socket = io();

document.addEventListener("DOMContentLoaded", () => {
  console.log("Code running");
  const docentBody = document.querySelector("docentenBodyBody");
  const LeerlingenMgraad = document.querySelector(
    "leerlingenMoeilijksheidgraad"
  );
  const homePageDiv = document.getElementById("homePageDiv");
  const docentenDiv = document.getElementById("docentenDiv");
  const leerlingDiv = document.getElementById("leerlingDiv");
  const titleElement = document.getElementById("title");
  const klasElement = document.getElementById("klas");
  const docentElement = document.getElementById("docent");
  const docentenTable = document.getElementById("docentenTable");
  const leerlingTable1 = document.getElementById("leerlingTable1");
  const leerlingTable2 = document.getElementById("leerlingTable2");
  const leerlingTable3 = document.getElementById("leerlingTable3");
  const leerlingTable4 = document.getElementById("leerlingTable4");
  const leerlingTable5 = document.getElementById("leerlingTable5");
  const docentenNaam = document.getElementById("docentenNaam");

  if (titleElement) {
    titleElement.addEventListener("click", () => {
      if (docentElement) {
        docentElement.style.textDecoration = "none";
        docentenTable.style.display = "none";
        docentenDiv.style.display = "none";
      }

      if (klasElement) {
        leerlingDiv.style.display = "none";
        leerlingTable1.style.display = "none";
        leerlingTable2.style.display = "none";
        leerlingTable3.style.display = "none";
        leerlingTable4.style.display = "none";
        leerlingTable5.style.display = "none";
        klasElement.style.textDecoration = "none";
      }
      homePageDiv.style.display = "flex";
      titleElement.style.textDecoration = "underline";
    });
  }

  if (klasElement) {
    klasElement.addEventListener("click", () => {
      if (docentElement) {
        docentElement.style.textDecoration = "none";
        docentenTable.style.display = "none";
        docentenDiv.style.display = "none";
      }
      if (titleElement) {
        titleElement.style.textDecoration = "none";
        homePageDiv.style.display = "none";
      }
      leerlingDiv.style.display = "block";
      klasElement.style.textDecoration = "underline";
      getClass();
    });
  }

  if (docentElement) {
    docentElement.addEventListener("click", () => {
      if (klasElement) {
        leerlingDiv.style.display = "none";
        leerlingTable1.style.display = "none";
        leerlingTable2.style.display = "none";
        leerlingTable3.style.display = "none";
        leerlingTable4.style.display = "none";
        leerlingTable5.style.display = "none";
        klasElement.style.textDecoration = "none";
      }
      if (titleElement) {
        titleElement.style.textDecoration = "none";
        homePageDiv.style.display = "none";
      }
      docentElement.style.textDecoration = "underline";
      docentenTable.style.display = "block";
      docentenDiv.style.display = "block";
      getDocent();
    });
  }
  function getClass() {
    socket.emit("getClass", {});
  }

  function getDocent() {
    socket.emit("getDocent", {});
  }

  socket.on("classDocentInfo", (data) => {
    console.log("Recieved docent info: ", data);
    renderDocentTable(data);
  });

  // Listen for the response from the server
  socket.on("classInfo", (data) => {
    //console.log("Received class information:", data);

    const leerlingenData1 = data.usersInSameClass.klas1;
    const leerlingenData2 = data.usersInSameClass.klas2;
    const leerlingenData3 = data.usersInSameClass.klas3;
    const leerlingenData4 = data.usersInSameClass.klas4;
    const leerlingenData5 = data.usersInSameClass.klas5;

    renderTable("leerlingTable1", leerlingenData1);
    renderTable("leerlingTable2", leerlingenData2);
    renderTable("leerlingTable3", leerlingenData3);
    renderTable("leerlingTable4", leerlingenData4);
    renderTable("leerlingTable5", leerlingenData5);

    // Enables the tables of which klassen the docent is in
    if (data.userClasses.klas1 === 1) {
      leerlingTable1.style.display = "block";
    }
    if (data.userClasses.klas2 === 1) {
      leerlingTable2.style.display = "block";
    }
    if (data.userClasses.klas3 === 1) {
      leerlingTable3.style.display = "block";
    }
    if (data.userClasses.klas4 === 1) {
      leerlingTable4.style.display = "block";
    }
    if (data.userClasses.klas5 === 1) {
      leerlingTable5.style.display = "block";
    }
  });
});

function renderDocentTable(data) {
  // Handle the docent information as needed
  const dataArray = Array.isArray(data.docenten.klas1)
    ? data.docenten.klas1
    : [];
  // Remove existing rows
  while (docentenTable.rows.length > 1) {
    docentenTable.deleteRow(1);
  }
  // Add new rows
  dataArray.forEach((docent) => {
    const row = docentenTable.insertRow();
    row.insertCell().innerText = docent.fullname;
    row.insertCell().innerText = docent.user_name;
    row.insertCell().innerText = docent.email;
    row.insertCell().innerText = docent.language;
    row.insertCell().innerText = docent.difficulty;
    row.insertCell().innerText = docent.permissions;
    row.insertCell().innerText = docent.klas1;
    row.insertCell().innerText = docent.klas2;
    row.insertCell().innerText = docent.klas3;
    row.insertCell().innerText = docent.klas4;
    row.insertCell().innerText = docent.klas5;
  });
}

function renderTable(tableId, classData) {
  const table = document.getElementById(tableId);

  // Ensure classData is an array
  const dataArray = Array.isArray(classData) ? classData : [];

  // Remove existing rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Add new rows
  dataArray.forEach((user) => {
    const row = table.insertRow();
    row.insertCell().innerText = "";
    row.insertCell().innerText = user.fullname || "";
    row.insertCell().innerText = user.user_name || "";
    row.insertCell().innerText = user.email || "";
    row.insertCell().innerText = user.language || "";
    row.insertCell().innerText = user.difficulty || "";
    row.insertCell().innerText = user.permissions || "";
  });
}
