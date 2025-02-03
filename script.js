const BASE_URL = "https://join-405-43178-default-rtdb.europe-west1.firebasedatabase.app/";
let loadedContacts = [];
let loadedTasks = [];
let allTasks = {};
let email = document.getElementById("email");
let password = document.getElementById("password");
let userName = document.getElementById("name");
let repeatPassword = document.getElementById("repeat-password");
let repeatPasswordError = document.getElementById("repeat-password-error");
let passwordError = document.getElementById("password-error");
let showPasswordImg = document.getElementById("show-password-img");
let showRepeatPasswordImg = document.getElementById("show-repeat-password-img");
let regardsUser = document.getElementById("regardsUser");
let colors = ["#007bff", "#ffa500", "#800080", "#d8bfd8", "#ff69b4", "#28a745", "#ff6347", "#20b2aa"];
let isPasswordVisible = false;
let isRepeatPasswordVisible = false;

/**
 * Initialisiert die Seite, indem alle erforderlichen Inhalte geladen werden.
 * Lädt Kontakte, Benutzerlogo und überprüft den Status des Benutzers.
 * @async
 */
async function init() {
  await includeHTML();
  await loadAllContacts();
  getUserLogo();
  inOrOut();
}

/**
 * Überprüft, ob der Benutzer eingeloggt ist.
 * Wenn ja, wird die `init`-Funktion aufgerufen, andernfalls wird der Benutzer zur Login-Seite weitergeleitet.
 */
function userCheck() {
  let status = JSON.parse(localStorage.getItem("loggedInUser"));
  if (status) {
    init();
  } else {
    window.location.href = '../index.html';
  }
}

/**
 * Lädt alle Kontakte aus dem lokalen Speicher oder von der Firebase-Datenbank.
 * Wenn keine Kontakte im lokalen Speicher vorhanden sind, werden sie aus der Datenbank geladen.
 * @async
 * @param {string} [path=""] - Der Pfad zu den Kontakten in der Datenbank.
 */
async function loadAllContacts(path = "") {
  let savedContacts = localStorage.getItem('contacts');
  loadedContacts = savedContacts ? JSON.parse(savedContacts) : [];
  
  if (typeof renderContacts === "function") renderContacts();

  if (!savedContacts) { 
      try {
          let response = await fetch(BASE_URL + path + ".json");
          let usersArray = Object.values((await response.json()).users);
          loadedContacts = usersArray.map(formatContact);
          
          if (typeof saveContactsToLocalStorage === "function") {
              saveContactsToLocalStorage();
          }

          if (typeof renderContacts === "function") renderContacts();
      } catch (error) {
          console.error("Fehler beim Laden der Kontakte aus der Datenbank:", error);
      }
  }
}

/**
 * Formatiert ein Kontaktobjekt, um sicherzustellen, dass alle Daten im richtigen Format vorliegen.
 * @param {Object} x - Das Kontaktobjekt.
 * @returns {Object} Das formatierte Kontaktobjekt.
 */
function formatContact(x) {
  let [vorname, nachname] = x.name.split(" ");
  return {
      color: x.color,
      name: x.name,
      email: x.email,
      password: x.password,
      phone: x.phone,
      letter: x.name[0].toUpperCase(),
      initialien: vorname[0] + (nachname ? nachname[0] : ""),
  };
}

/**
 * Ruft die Aufgaben von der Firebase-Datenbank ab und speichert sie im lokalen Speicher.
 * @async
 */
async function fetchAndStoreTasks() {
  try {
    let response = await fetch(`${BASE_URL}/tasks.json`);
    let tasksData = await response.json();

    loadedTasks.push(tasksData);
    saveTasksInLocalStorage(loadedTasks);
  } catch (error) {
    console.error("Fehler:", error.message);
  }
}

/**
 * Speichert Aufgaben im lokalen Speicher.
 * @param {Array} loadedTasks - Die geladenen Aufgaben.
 */
function saveTasksInLocalStorage(loadedTasks) {
  localStorage.setItem("await-feedback",JSON.stringify(loadedTasks[0]["-OHEHGcS4ouKKz4lJ0nr"].awaitFeedback));
  localStorage.setItem("todo",JSON.stringify(loadedTasks[0]["-OHEHGcS4ouKKz4lJ0nr"].todo));
  localStorage.setItem("in-progress",JSON.stringify(loadedTasks[0]["-OHEHGcS4ouKKz4lJ0nr"].inProgress));
  localStorage.setItem("done",JSON.stringify(loadedTasks[0]["-OHEHGcS4ouKKz4lJ0nr"].done));
  console.log(loadedTasks[0]["-OHEHGcS4ouKKz4lJ0nr"].awaitFeedback);
}

/**
 * Ändert das Symbol zum Anzeigen des Passworts, je nachdem, ob das Passwort-Feld gefüllt ist oder nicht.
 */
function changePasswordImg() {
  if (password && password.value) {
    showPasswordImg.src = isPasswordVisible 
      ? "../Assets/visibility.png" 
      : "../Assets/visibility_off.png";
    showPasswordImg.style.cursor = "pointer";
  } else if (showPasswordImg) {
    showPasswordImg.src = "../Assets/lock.png";
    showPasswordImg.style.cursor = "default";
  }
}

/**
 * Ändert das Symbol zum Anzeigen des wiederholten Passworts, je nachdem, ob das Passwort-Feld gefüllt ist oder nicht.
 */
function changeRepeatPasswordImg() {
  if (repeatPassword && repeatPassword.value) {
    showRepeatPasswordImg.src = isRepeatPasswordVisible 
      ? "../Assets/visibility.png" 
      : "../Assets/visibility_off.png";
    showRepeatPasswordImg.style.cursor = "pointer";
  } else if (showRepeatPasswordImg) {
    showRepeatPasswordImg.src = "../Assets/lock.png";
    showRepeatPasswordImg.style.cursor = "default";
  }
}

/**
 * Zeigt das Passwort an oder versteckt es basierend auf dem aktuellen Zustand des Passwort-Felds.
 */
function showPassword() {
  if (password && password.value.length >= 1) {
    isPasswordVisible = !isPasswordVisible;
    password.type = isPasswordVisible ? "text" : "password";
    showPasswordImg.src = isPasswordVisible 
      ? "../Assets/visibility.png" 
      : "../Assets/visibility_off.png";
  }
}

/**
 * Zeigt das wiederholte Passwort an oder versteckt es basierend auf dem aktuellen Zustand des Wiederholungs-Passwort-Felds.
 */
function showRepeatPassowrd() {
  if (repeatPassword && repeatPassword.value.length >= 1) {
    isRepeatPasswordVisible = !isRepeatPasswordVisible;
    repeatPassword.type = isRepeatPasswordVisible ? "text" : "password";
    showRepeatPasswordImg.src = isRepeatPasswordVisible 
      ? "../Assets/visibility.png" 
      : "../Assets/visibility_off.png";
  }
}

/**
 * Lädt HTML-Dateien, die in der Seite eingebunden werden sollen, asynchron.
 * @async
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/*.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * Lädt den Inhalt einer Seite in das Haupt-Element der Seite.
 * @async
 * @param {string} page - Der Name der Seite, die geladen werden soll.
 */
async function loadContent(page) {
  console.log(page);
  let element = document.getElementById("main-content");
  let resp = await fetch("./HTML/" + page + ".html");
  if (resp.ok) {
    element.innerHTML = await resp.text();
  } else {
    element.innerHTML = "Page not found";
  }
}

/**
 * Ruft das Benutzerlogo ab und zeigt es an.
 */
function getUserLogo() {
  let userLogo = document.getElementById("user-button");
  let user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    return;
  }

  let initials = user.initialien;
  let color = user.color || "#3498db";

  if (userLogo) {
    userLogo.innerHTML = renderUserLogo(initials, color, user);
  }
}

/**
 * Versteckt das Animationselement nach einer kurzen Verzögerung, wenn es noch nicht angezeigt wurde.
 */
document.addEventListener("DOMContentLoaded", () => {
  const isAnimationShown = localStorage.getItem("welcomeAnimationShown");
  const animationDiv = document.getElementById("animation");

  if (!animationDiv) {
    return;
  }

  if (!isAnimationShown) {
    setTimeout(() => {
      animationDiv.style.display = "none";
      localStorage.setItem("welcomeAnimationShown", "true");
    }, 2000);
  } else {
    animationDiv.style.display = "none";
  }
});

/**
 * Überprüft die Fenstergröße und ändert die Anzeige des mobilen Elements.
 * @event window#resize
 * @listens window#resize
 */
document.addEventListener("DOMContentLoaded", () => {
  let isMobile = window.innerWidth <= 830;
  let isAnimationShowSummary = localStorage.getItem("welcomeAnimationShowSummary");
  let regardDiv = document.getElementById("regardsUserMobile");
  if (!regardDiv) {
    return;
  }

  if (isMobile) {
    if (!isAnimationShowSummary) {
      setTimeout(() => {
        regardDiv.style.display = "none";
        localStorage.setItem("welcomeAnimationShowSummary", "true");
      }, 2000);
    } else {
      regardDiv.style.display = "none";
    }
  }
});

/**
 * Fügt einen Klick-Effekt zu einem Element hinzu.
 * @param {string} elementId - Die ID des Elements, das den Klick-Effekt erhalten soll.
 */
function addClickEffect(elementId) {
  let element = document.getElementById(elementId);
  if (element) {
    element.addEventListener("mousedown", () => {
      element.classList.add("color-on-click");
    });

    element.addEventListener("mouseup", () => {
      element.classList.remove("color-on-click");
    });

    element.addEventListener("mouseleave", () => {
      element.classList.remove("color-on-click");
    });
  }
}

addClickEffect("login-click-privacy");
addClickEffect("login-click-legal");

/**
 * Überprüft, ob ein Benutzer eingeloggt ist.
 * Wenn nicht, wird der Benutzer zur Login-Seite weitergeleitet.
 */
function checkIfLoggedIn() {
  let loggedUser = localStorage.getItem('loggedInUser');
  console.log(loggedUser);
  if (!loggedUser) {
    window.location.href = '/index.html';
  }
}