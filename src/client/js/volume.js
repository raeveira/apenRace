 // Add this JavaScript code to your page
 document.addEventListener("DOMContentLoaded", function () {
    // Get all the input elements
    const sliders = document.querySelectorAll(".slider");
    const percentages = document.querySelectorAll(".percentage");

    // Add event listeners to each input element
    sliders.forEach((slider, index) => {
      slider.addEventListener("input", () => {
        // Update the corresponding percentage value
        percentages[index].textContent = `${slider.value}%`;
      });
    });
  });