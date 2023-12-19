document.addEventListener("DOMContentLoaded", () => {
    const loginformDocent = document.querySelector("#login1");
    const loginformAdmin = document.querySelector("#login2");
    const keuzeMenu = document.querySelector("#keuzemenuDocenten");

document
.querySelector("#kmd_DocentInloggen")
.addEventListener('click', (e) => {
  e.preventDefault();
  loginformAdmin.classList.add("form--hidden");
  loginformDocent.classList.remove("form--hidden");
  keuzeMenu.classList.remove("#keuzemenuDocenten");
});

document
.querySelector("#kmd_AdminInloggen")
.addEventListener('click', (e) => {
  e.preventDefault();
  loginformAdmin.classList.remove("form--hidden");
  loginformDocent.classList.add("form--hidden");
  keuzeMenu.classList.remove("#keuzemenuDocenten");
});

});