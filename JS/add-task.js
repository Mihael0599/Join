let dropDownArrowContacts = document.getElementById("drop-down-arrow-contacts");
let dropDownArrowCategory = document.getElementById("drop-down");
let concatList = document.getElementById("contact-list");
let selectedUsers = [];
let selectedPriority = "";
let contacState = 1;
let categoryState = 1;
let selectedCategory = "";
const categorySelect = document.getElementById("categorySelect");
const selectedCategoryElement = document.getElementById("selected-category");
let body = document.getElementById("body");
let title = document.getElementById("title-input");
let description = document.getElementById("description");
let date = document.getElementById("date-input");
let titleError = document.getElementById("title-error");
let descriptionError = document.getElementById("description-error");
let dateError = document.getElementById("date-error");
let categoryError = document.getElementById("category-error");

renderSubtasks();

/**
 * Öffnet oder schließt das Dropdown-Menü für Benutzer (Kontakte).
 */
function openDropDownMenuUser() {
  switch (contacState) {
    case 1:
      concatList.style.display = "flex";
      dropDownArrowContacts.src = "../Assets/arrow_drop_downaa.png";
      contacState = 2;
      addUserToTask();
      break;
    case 2:
      concatList.style.display = "none";
      dropDownArrowContacts.src = "../Assets/arrow_drop_downaa (1).png";
      contacState = 1;
      break;
  }
}

/**
 * Öffnet oder schließt das Dropdown-Menü für Benutzer (Kontakte).
 */
function openDropDownMenuCategory() {
  switch (categoryState) {
    case 1:
      categorySelect.style.display = "block";
      dropDownArrowCategory.src = "../Assets/arrow_drop_downaa.png";
      categoryState = 2;
      break;
    case 2:
      categorySelect.style.display = "none";
      dropDownArrowCategory.src = "../Assets/arrow_drop_downaa (1).png";
      categoryState = 1;
      break;
  }
}

/**
 * Öffnet oder schließt das Dropdown-Menü für Benutzer (Kontakte).
 */
function addUserToTask() {
  concatList.innerHTML = "";

  loadedContacts.forEach((user, index) => {
    let isChecked = selectedUsers.includes(user) ? "checked" : "";
    let selectedClass = selectedUsers.includes(user) ? "selected-user" : "";

    let initials = user.initialien;
    let color = user.color;

    concatList.innerHTML += renderAddToTaskContacts(color, initials, user, index, isChecked, selectedClass);
  });
}

/**
 * Öffnet oder schließt das Dropdown-Menü für Benutzer (Kontakte).
 */
function checkBoxUserTask(index, event) {
  event.stopPropagation();

  const user = loadedContacts[index];
  const contactElement = document.querySelectorAll('.contact')[index];
  const checkbox = contactElement.querySelector('input[type="checkbox"]');

  if (event.target.tagName !== "INPUT") {
    checkbox.checked = !checkbox.checked;
  }

  if (checkbox.checked) {
    if (!selectedUsers.includes(user)) {
      selectedUsers.push(user);
    }
    contactElement.classList.add('selected-user');
  } else {
    selectedUsers = selectedUsers.filter((u) => u !== user);
    contactElement.classList.remove('selected-user');
  }

  addedUsers();
}

/**
 * Öffnet oder schließt das Dropdown-Menü für Benutzer (Kontakte).
 */
function addedUsers() {
  let addedUsers = document.getElementById("addedUers");
  let maxVisibleUsers = 4;
  addedUsers.innerHTML = "";

  selectedUsers.slice(0, maxVisibleUsers).forEach((user) => {
    let initials = user.initialien;

    let color = user.color;

    addedUsers.innerHTML += renderAddedUsers(color, initials);

  });
  if (selectedUsers.length > maxVisibleUsers) {
    let remainingCount = selectedUsers.length - maxVisibleUsers;
    addedUsers.innerHTML += renderAddedUsersPlaceholder(`+${remainingCount}`);
  }
}

/**
 * Setzt alle Eingabewerte und UI-Elemente zurück, um eine neue Aufgabe zu erstellen.
 */
function clearTask() {
  title.value = "";
  description.value = "";
  document.getElementById("addedUers").innerHTML = "";
  date.value = "";
  document.getElementById("newSubtask").value = "";
  document.getElementById("subtaskLabels").innerHTML = "";
  document.getElementById("selected-category").innerHTML =
    "Select task category";
  btnMedium.style.backgroundColor = "#FFA800";
  imgMedium.src = "../Assets/prio_medium.png";
  btnLow.style.backgroundColor = "#ffffff";
  imgLow.src = "../Assets/prio_low.png"
  btnUrgent.style.backgroundColor = "#ffffff";
  imgUrgent.src = "../Assets/prio_urgent.png";
}

/**
 * Wählt eine Kategorie für die Aufgabe aus und schließt das Dropdown-Menü.
 * 
 * @param {string} category - Die ausgewählte Kategorie.
 */
function selectCategory(category) {
  selectedCategory = category;
  selectedCategoryElement.innerText = category;
  categorySelect.style.display = "none";
  categoryError.style.display = "none";
  state = 1;
  dropDownArrowCategory.src = "../Assets/arrow_drop_downaa (1).png";
}

/**
 * Erstellt eine neue Aufgabe mit den angegebenen Parametern.
 * 
 * @param {string} title - Der Titel der Aufgabe.
 * @param {string} description - Die Beschreibung der Aufgabe.
 * @param {string} dueDate - Das Fälligkeitsdatum der Aufgabe.
 * @param {string} priority - Die Priorität der Aufgabe.
 * @param {string} category - Die Kategorie der Aufgabe.
 * @param {Array} subtaskList - Die Liste der Unteraufgaben.
 * @param {Array} selectedUsers - Die Liste der zugewiesenen Benutzer.
 * 
 * @returns {Object} Die erstellte Aufgabe.
 */
function createNewTask(title, description, dueDate, priority, category, subtaskList, selectedUsers) {
  const { completedSubtasks, totalSubtasks } = countSubtasks(subtaskList);
  return { id: `task-${Date.now()}`, title, description, dueDate, priority, category, subtasks: subtaskList, completedSubtasks, totalSubtasks, assignedUsers: selectedUsers, };
}

/**
 * Speichert eine Aufgabe in localStorage.
 * 
 * @param {string} columnId - Die Spalten-ID, in der die Aufgabe gespeichert werden soll.
 * @param {Object} newTask - Die neue Aufgabe, die gespeichert wird.
 */
function saveTaskToLocalStorage(columnId, newTask) {
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  tasks.push(newTask);
  localStorage.setItem(columnId, JSON.stringify(tasks));
}

/**
 * Überprüft, ob eine Kategorie ausgewählt wurde.
 * 
 * @returns {boolean} True, wenn eine Kategorie ausgewählt wurde, sonst false.
 */
function isCategorySelected() {
  return selectedCategory !== "";
}

/**
 * Überprüft, ob die Aufgabe hinzugefügt werden kann (alle Felder sind valide).
 */
function checkAddTaks() {
  let valid = true;
  if (title.value.length < 1) {
    titleError.style.display = "flex";
    titleError.innerHTML = "Bitte Fügen Sie einen Titel hinzu";
    valid = false;
  }
  if (description.value.length < 1) {
    descriptionError.innerHTML = "Bitte Fügen Sie eine Beschreibung hinzu";
    descriptionError.style.display = "flex";
    valid = false;
  }
  if (date.value.length < 1) {
    dateError.style.display = "flex";
    dateError.innerHTML = "Bitte ein Datum auswählen";
    valid = false;
  }
  if (!isCategorySelected()) {
    categoryError.style.display = "flex";
    categoryError.innerHTML = "Bitte wählen Sie eine Kategorie für die Aufgabe aus";
    valid = false;
  }
  if (valid) {
    addTaskMsg();
  }
}

/**
* Löscht den Fehlertext für das Titel-Feld.
*/
function clearTitleError() {
  titleError.innerHTML = "";
}

/**
 * Löscht den Fehlertext für das Beschreibung-Feld.
 */
function clearDescriptionError() {
  descriptionError.innerHTML = "";
}

/**
 * Löscht den Fehlertext für das Datum-Feld.
 */
function clearDateError() {
  dateError.innerHTML = "";
}

/**
 * Fügt eine neue Aufgabe hinzu und speichert sie.
 */
function addTask() {
  const title = getFormInputValue("title-input");
  const description = getFormInputValue("description");
  const dueDate = getFormInputValue("date-input");
  const priority = selectedPriority || "medium";
  const category = selectedCategory;

  const newTask = createNewTask(title, description, dueDate, priority, category, subtaskList, selectedUsers);
  const currentColumn = localStorage.getItem("currentColumn") || "todo";
  saveTaskToLocalStorage(currentColumn, newTask);
  window.location.href = "board.html";
}

/**
 * Schließt die Dropdown-Menüs für Kontakte und Kategorien, wenn ein Klick außerhalb dieser Elemente erfolgt.
 * 
 * @param {Event} event - Das Klick-Ereignis, das den Funktionsaufruf auslöst.
 */
body.onclick = function (event) {
  if (!event.target.closest("#input-contacts") && !event.target.closest("#input-category")) {
    concatList.style.display = "none";
    dropDownArrowContacts.src = "../Assets/arrow_drop_downaa (1).png";
    contacState = 1;

    categorySelect.style.display = "none";
    dropDownArrowCategory.src = "../Assets/arrow_drop_downaa (1).png";
    categoryState = 1;
  }
};

/**
 * Zeigt eine Nachricht an, dass eine Aufgabe erfolgreich hinzugefügt wurde.
 */
function addTaskMsg() {
  let msgContainer = document.getElementById("add-task-msg");

  msgContainer.style.display = "flex";
  setTimeout(() => {
    msgContainer.style.display = "none";
    addTask();
    window.location.href = "/HTML/board.html";
  }, 2000);
}

/**
 * Schaltet den Abschlussstatus einer Unteraufgabe um (erledigt/nicht erledigt).
 * 
 * @param {number} index - Der Index der Unteraufgabe in der Liste.
 */
function toggleSubtaskCompletion(index) {
  const checkbox = document.getElementById(`subtask-checkbox-${index}`);
  if (checkbox.checked) {
    subtaskList[index].completed = true;
  } else {
    subtaskList[index].completed = false;
  }
}