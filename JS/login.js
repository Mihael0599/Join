/**
 * Holt die URL-Parameter und extrahiert den Wert des Parameters "msg".
 * @type {URLSearchParams}
 */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
let msgBox = document.getElementById("msgBox");

/**
 * Führt den Login-Vorgang für den Benutzer durch, überprüft die E-Mail und das Passwort und leitet den Benutzer weiter.
 * @async
 */
async function userLogIn() {
  let emailError = document.getElementById("email-error");
  let passwordError = document.getElementById("password-error");

  emailError.innerHTML = "";
  passwordError.innerHTML = "";
  await fetchAndStoreTasks();

  let user = loadedContacts.find((u) => u.email === email.value);

  if (user) {
    if (user.password === password.value) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "../HTML/summary.html";

      email.value = "";
      password.value = "";
    } else {
      passwordError.style.display = "flex";
      passwordError.innerHTML = "Check your email and password. Please try again.";
    }
  } else {
    emailError.style.display = "flex"
    emailError.innerHTML = "User not found. Please check your email.";
  }
}

/**
 * Führt den Login-Vorgang für einen Gastbenutzer durch, lädt die Aufgaben und leitet den Gast weiter.
 * @async
 */
async function guestLogin() {
  await fetchAndStoreTasks();
  let guestUser = {
    name: "",
    email: null,
    color: "#95a5a6",
    initialien: "G",
  };
  localStorage.setItem("loggedInUser", JSON.stringify(guestUser));
  window.location.href = "../HTML/summary.html";
  getUserLogo();
}