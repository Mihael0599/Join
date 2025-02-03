let userNameError = document.getElementById("name-error")
let emailError = document.getElementById("email-error");

/**
 * Überprüft das gesamte Anmeldeformular, indem jedes Feld validiert wird.
 * @returns {boolean} Gibt true zurück, wenn alle Felder gültig sind, andernfalls false.
 */
function checkSignUp() {
  let isNameValid = checkName();
  let isEmailValid = checkEmail();
  let isPasswordValid = checkPassword();
  let isRepeatPasswordValid = checkRepeatPassword();

  return isNameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid;
}

/**
 * Überprüft die Gültigkeit des Namensfeldes.
 * @returns {boolean} Gibt false zurück, wenn der Name leer ist, andernfalls true.
 */
function checkName() {
  if (userName.value.length === 0) {
    userNameError.style.display = "flex";
    userNameError.innerHTML = "Please enter your name";
    return false;
  } else {
    userNameError.innerHTML = "";
    return true;
  }
}

/**
 * Überprüft die Gültigkeit des E-Mail-Feldes.
 * @returns {boolean} Gibt false zurück, wenn die E-Mail ungültig ist, andernfalls true.
 */
function checkEmail() {
  if (!isValidEmail(email.value)) {
    emailError.style.display = "flex";
    emailError.innerHTML = "Please enter a valid email address.";
    return false;
  } else {
    emailError.innerHTML = "";
    return true;
  }
}

/**
 * Überprüft die Gültigkeit des Passwortfeldes.
 * @returns {boolean} Gibt false zurück, wenn das Passwort zu kurz ist, andernfalls true.
 */
function checkPassword() {
  if (password.value.length < 8) {
    passwordError.style.display = "flex";
    passwordError.innerHTML = "Password must have at least 8 characters.";
    return false;
  } else {
    passwordError.innerHTML = "";
    return true;
  }
}

/**
 * Überprüft, ob das Passwort und das Bestätigungspasswort übereinstimmen.
 * @returns {boolean} Gibt false zurück, wenn die Passwörter nicht übereinstimmen, andernfalls true.
 */
function checkRepeatPassword() {
  if (password.value !== repeatPassword.value) {
    repeatPasswordError.style.display = "flex";
    repeatPasswordError.innerHTML = "Your passwords don't match. Please try again.";
    return false;
  } else {
    repeatPasswordError.innerHTML = "";
    return true;
  }
}

/**
 * Erstellt ein neues Benutzerobjekt und sendet es an den Server.
 */
function addUser() {
  const newUser = {
    name: userName.value,
    email: email.value,
    password: password.value,
    phone: "",
    color: colors[Object.keys(loadedContacts).length % colors.length],
  };

  postUser(newUser);

  email.value = "";
  password.value = "";
  userName.value = "";
  repeatPassword.value = "";
}


/**
 * Aktiviert oder deaktiviert den Anmelde-Button basierend auf der Gültigkeit der Eingabefelder.
 */
function allowSignup() {
  let userName = document.getElementById("name");
  let email = document.getElementById("email");
  let checkbox = document.getElementById("checkbox");
  let signupBtn = document.getElementById("signup");

  if (userName.value.trim().length > 1 && isValidEmail(email.value) && checkbox.checked && checkSignUp()) {
    signupBtn.style.backgroundColor = "#2a3647";
    signupBtn.style.border = "solid #2a3647";
    signupBtn.style.color = "white";
    signupBtn.disabled = false;
  } else {
    signupBtn.style.backgroundColor = "";
    signupBtn.style.border = "";
    signupBtn.style.color = "";
    signupBtn.disabled = true;
  }
}

/**
 * Überprüft das Format der E-Mail mit einer regulären Ausdruck.
 * @param {string} email - Die zu validierende E-Mail-Adresse.
 * @returns {boolean} Gibt true zurück, wenn die E-Mail gültig ist, andernfalls false.
 */
function isValidEmail(email) {
  let emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(email);
}

/**
 * Sendet die neuen Benutzerdaten an den Server, um sie zu speichern.
 * @param {Object} newUser - Das Benutzerobjekt mit Name, E-Mail, Passwort usw.
 * @returns {Promise<void>} Gibt ein Versprechen zurück, das sich erfüllt, wenn die Benutzerdaten gesendet wurden.
 */
async function postUser(newUser) {
  try {
    let response = await fetch(`${BASE_URL}/users.json`);

    const users = await response.json();
    const userCount = users ? Object.keys(users).length : 0;
    const userId = `user${userCount + 1}`;

    response = await fetch(`${BASE_URL}/users/${userId}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
  } catch (error) {
    console.error("Benutzer konnte nicht geladen werden", error);
  }
  signUpMsg();
}

/**
 * Zeigt eine Bestätigungsmeldung für die Anmeldung an und leitet den Benutzer nach 2 Sekunden weiter.
 */
function signUpMsg() {
  let msgContainer = document.getElementById("signup-msg");

  msgContainer.style.display = "flex";
  setTimeout(() => {
    msgContainer.style.display = "none";
    window.location.href = "/index.html";
  }, 2000);
}
