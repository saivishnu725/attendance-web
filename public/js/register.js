const registrationForm = document.getElementById("registrationForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");

// Event listener for username input
usernameInput.addEventListener("input", () => {
  const username = emailInput.value.trim();
  // Clear previous error message
  if (username.length > 0) {
    // Make an asynchronous request to check if the email exists
    fetch(`/check-username?username=${username}`)
      .then((response) => response.json())
      .then((username) => {
        if (username.exists) usernameInput.classList.add("is-invalid");
      })
      .catch((error) => console.error("Error:", error));
  }
});

// Event listener for email input
emailInput.addEventListener("input", () => {
  const email = emailInput.value.trim();
  // Clear previous error message
  emailError.textContent = "";

  if (email.length > 0) {
    // Make an asynchronous request to check if the email exists
    fetch(`/check-email?email=${email}`)
      .then((response) => response.json())
      .then((email) => {
        if (email.exists) emailInput.classList.add("is-invalid");
      })
      .catch((error) => console.error("Error:", error));
  }
});
