/**
 * Icons für die Prioritätsstufen von Aufgaben
 * @constant {Object}
 */
const priorityIcons = {
  urgent: "../Assets/prio_arrow_white.png",
  medium: "../Assets/prio_medium.png",
  low: "../Assets/prio_arrowDown_white.png",
};

/**
 * Initialisiert das Dashboard und lädt alle notwendigen Daten.
 */
function initSummary() {
  loadTasksFromLocalStorage();
  displayTaskCounts();
  displayTotalTaskCount();
  displayNextDueTask();
  time();
}

/**
 * Bestimmt die aktuelle Tageszeit und zeigt die entsprechende Begrüßung an.
 */
function time() {
  let date = new Date();
  let hour = date.getHours();

  let greeting = document.getElementById("greeting");
  if (hour >= 19) {
    greeting = "Good Evening";
  } else if (hour >= 12) {
    greeting = "Good Afternoon";
  } else if (hour >= 6) {
    greeting = "Good Morning";
  } else {
    greeting = "Hello";
  }
  renderRegardsUser(greeting);
  renderRegardsUserMobile(greeting);
}

/**
 * Zeigt eine personalisierte Begrüßung für den eingeloggten Benutzer an.
 * @param {string} greeting - Die Begrüßung basierend auf der Tageszeit.
 */
function renderRegardsUser(greeting) {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let userName = loggedInUser ? loggedInUser.name : "";
  let regardsUser = document.getElementById("regardsUser");

  if (regardsUser && userName == "") {
    regardsUser.innerHTML = regardsGastTemplate(greeting, userName);
  } else {
    regardsUser.innerHTML = regardsUserTemplate(greeting, userName);
  }
}

/**
 * Zeigt eine personalisierte Begrüßung in Mobile Ansicht für den eingeloggten Benutzer an.
 * @param {string} greeting - Die Begrüßung basierend auf der Tageszeit.
 */
function renderRegardsUserMobile(greeting) {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let userName = loggedInUser ? loggedInUser.name : "";
  let regardsUser = document.getElementById("regardsUserMobile");

  if (regardsUser && userName == "") {
    regardsUser.innerHTML = regardsGastTemplate(greeting, userName);
  } else {
    regardsUser.innerHTML = regardsUserTemplate(greeting, userName);
  }
}

/**
 * Lädt gespeicherte Aufgaben aus dem Local Storage.
 */
function loadTasksFromLocalStorage() {
  allTasks = {
    todo: JSON.parse(localStorage.getItem("todo")) || [],
    inProgress: JSON.parse(localStorage.getItem("in-progress")) || [],
    awaitFeedback: JSON.parse(localStorage.getItem("await-feedback")) || [],
    done: JSON.parse(localStorage.getItem("done")) || [],
  };
}

/**
 * Gibt die Anzahl der Aufgaben in einer bestimmten Kategorie zurück.
 * @param {string} category - Der Name der Aufgaben-Kategorie.
 * @returns {number} - Anzahl der Aufgaben in der Kategorie.
 */
function getTaskCount(category) {
  if (allTasks[category]) {
    return allTasks[category].length;
  }
  console.warn(`Kategorie "${category}" nicht gefunden.`);
  return 0;
}

/**
 * Zeigt die Anzahl der Aufgaben für jede Kategorie an.
 */
function displayTaskCounts() {
  const todoCount = getTaskCount("todo");
  const inProgressCount = getTaskCount("inProgress");
  const awaitFeedbackCount = getTaskCount("awaitFeedback");
  const doneCount = getTaskCount("done");

  document.getElementById("todoCount").innerHTML = todoCount;
  document.getElementById("inProgressCount").innerHTML = inProgressCount;
  document.getElementById("awaitFeedbackCount").innerHTML = awaitFeedbackCount;
  document.getElementById("doneCount").innerHTML = doneCount;
}

/**
 * Gibt die Gesamtzahl aller Aufgaben zurück.
 * @returns {number} - Gesamtanzahl der Aufgaben.
 */
function getTotalTaskCount() {
  let totalCount = 0;
  for (const category in allTasks) {
    if (Array.isArray(allTasks[category])) {
      totalCount += allTasks[category].length;
    }
  }
  return totalCount;
}

/**
 * Zeigt die Gesamtanzahl aller Aufgaben auf der Benutzeroberfläche an.
 */
function displayTotalTaskCount() {
  let totalCount = getTotalTaskCount();
  let totalCountElement = document.getElementById("totalTaskCount");
  if (totalCountElement) {
    totalCountElement.textContent = totalCount;
  } else {
    console.error("Element mit ID 'totalTaskCount' nicht gefunden.");
  }
}

/**
 * Gibt die nächste anstehende Aufgabe basierend auf dem Fälligkeitsdatum zurück.
 * @returns {Object|null} - Die nächste Aufgabe oder null, falls keine vorhanden ist.
 */
function getNextDueTask() {
  let allTasksCombined = [
    ...allTasks.todo,
    ...allTasks.inProgress,
    ...allTasks.awaitFeedback,
    ...allTasks.done,
  ];

  let tasksWithDueDate = allTasksCombined.filter(task => task.dueDate);

  tasksWithDueDate.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return tasksWithDueDate[0] || null;
}

/**
 * Formatiert ein Datum als lesbare Zeichenkette.
 * @param {string} dateString - Das Datum als String.
 * @returns {string} - Formatiertes Datum im Langformat.
 */
function formatDateLong(dateString) {
  let date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Gibt das passende Icon für eine Priorität zurück.
 * @param {string} priority - Die Priorität (urgent, medium, low).
 * @returns {string} - Pfad zum entsprechenden Icon.
 */
function getPriorityIcon(priority) {
  return priorityIcons[priority];
}

/**
 * Gibt die CSS-Klasse für eine Priorität zurück.
 * @param {string} priority - Die Priorität.
 * @returns {string} - CSS-Klassenname.
 */
function getPriorityClass(priority) {
  return `prio-${priority}`; 
}

/**
 * Gibt den Text für eine Priorität zurück.
 * @param {string} priority - Die Priorität.
 * @returns {string} - Textbeschreibung der Priorität.
 */
function getPriorityText(priority) {
  switch (priority) {
    case "urgent":
      return "Urgent";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return "Unknown";
  }
}

/**
 * Zeigt die nächste anstehende Aufgabe an.
 */
function displayNextDueTask() {
  const nextTask = getNextDueTask();
  const nextDueElement = document.getElementById("task-info");

  if (nextTask && nextDueElement) {
    const priorityIcon = getPriorityIcon(nextTask.priority); 
    const formattedDate = formatDateLong(nextTask.dueDate); 
    const priorityText = getPriorityText(nextTask.priority); 

    nextDueElement.innerHTML = getDueDateTemplate(priorityIcon, formattedDate, priorityText);
  } else if (nextDueElement) {
    nextDueElement.innerHTML = "<p>Keine anstehenden Aufgaben gefunden.</p>";
  }
}