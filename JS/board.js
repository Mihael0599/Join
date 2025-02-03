let selectedUsers = [];
let searchText = "";
let currentTaskId = null;
let draggedTaskId = null;


/**
 * Loads tasks from local storage for a given column.
 * @param {string} columnId - The column ID.
 */
function loadTasks(columnId) {
  const container = document.getElementById(`${columnId}-tasks`);
  container.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  tasks.forEach((task) => {
    container.innerHTML += renderTask(task);
    updateArrowIcons(columnId, task.id);
    showSubtaskProgress(task);
  });
  updateTaskVisibilityById(columnId);
  
}


/**
 * Gets the priority text from a task element.
 * @param {HTMLElement} taskElement - The task element.
 * @returns {string} - Priority text.
 */
function getPriorityText(taskElement) {
  return taskElement.querySelector(".user-container p img")
    ? taskElement
        .querySelector(".user-container p img")
        .alt.replace(" Priority", "")
    : taskElement.querySelector(".user-container p").innerText.trim();
}


/**
 * Returns the priority icon based on priority text.
 * @param {string} priorityText - Priority level.
 * @returns {string} - Icon path.
 */
function getPriorityIcon(priorityText) {
  switch (priorityText.toLowerCase()) {
    case "low":
      return "../Assets/prio_low.png";
    case "medium":
      return "../Assets/prio_medium_orang.png";
    case "urgent":
      return "../Assets/prio_urgent.png";
    default:
      return "../Assets/prio_medium_orang.png";
  }
}


/**
 * Retrieves assigned users from a task element.
 * @param {HTMLElement} taskElement - The task element.
 * @returns {Array<{name: string, color: string}>} - Assigned users.
 */
function getAssignedUsers(taskElement) {
  return Array.from(taskElement.querySelectorAll(".user-avatar")).map(
    (user) => ({
      name: user.innerText.trim(),
      color: user.style.backgroundColor,
    })
  );
}


/**
 * Creates a task object from an element.
 * @param {HTMLElement} taskElement - The task element.
 * @param {string} taskId - Task ID.
 * @returns {Object} - Task object.
 */
function createTaskObject(taskElement, taskId) {
  const priorityText = getPriorityText(taskElement);
  return {
    id: taskId,
    title: taskElement.querySelector("h4").innerText,
    description: taskElement.querySelector("p").innerText,
    priority: priorityText,
    priorityIcon: getPriorityIcon(priorityText),
    category: taskElement.querySelector(".category-label").innerText.trim(),
    assignedUsers: getAssignedUsers(taskElement),
    subtasks: taskElement.subtasks || [],
    completedSubtasks: taskElement.completedSubtasks || []
  };
}


/**
 * Saves a task to local storage.
 * @param {string} columnId - Column ID.
 * @param {HTMLElement} taskElement - Task element.
 * @param {string} taskId - Task ID.
 */
function saveTaskToLocalStorage(columnId, taskElement, taskId) {
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  if (!tasks.find((task) => task.id === taskId)) {
    const newTask = createTaskObject(taskElement, taskId);
    tasks.push(newTask);
    localStorage.setItem(columnId, JSON.stringify(tasks));
  }
}


/**
 * Updates task visibility in a column.
 * @param {string} columnId - Column ID.
 */
function updateTaskVisibilityById(columnId) {
  const container = document.getElementById(`${columnId}-tasks`);
  const taskList = document.querySelector(`#${columnId} .task-list`);
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  taskList.style.display = tasks.length > 0 ? "none" : "block";
  const visibleTasks = container.querySelectorAll(
    '.user-card:not([style*="display: none"])'
  );
  taskList.style.display = visibleTasks.length === 0 ? "block" : "none";
}


/**
 * Filters tasks based on search input.
 * @param {string} searchText - Search text.
 */
function filterTasksBySearch(searchText) {
  document.querySelectorAll(".user-card").forEach((task) => {
    const taskTitle = task.querySelector("h4")?.textContent.toLowerCase() || "";
    task.style.display =
      searchText.length < 3 || taskTitle.includes(searchText)
        ? "block"
        : "none";
  });
}


/**
 * Searches tasks from the task search input.
 */
function searchFromSearchTaskInput() {
  const searchInput = document.querySelector("#searchTask");
  const searchText =
    searchInput && searchInput.offsetParent !== null
      ? searchInput.value.trim().toLowerCase()
      : "";
  filterTasksBySearch(searchText);
  ["todo", "in-progress", "await-feedback", "done"].forEach(
    updateTaskVisibilityById
  );
}


/**
 * Searches tasks from the general search input.
 */
function searchFromSearchInput() {
  const searchInput = document.querySelector("#search");
  const searchText =
    searchInput && searchInput.offsetParent !== null
      ? searchInput.value.trim().toLowerCase()
      : "";
  filterTasksBySearch(searchText);
  ["todo", "in-progress", "await-feedback", "done"].forEach(
    updateTaskVisibilityById
  );
}


/**
 * Loads tasks when the page loads.
 */
window.addEventListener("load", function () {
  ["todo", "in-progress", "await-feedback", "done"].forEach(loadTasks);
});


/**
 * Formats a date string as DD/MM/YYYY.
 * @param {string} dateString - Date string.
 * @returns {string} - Formatted date or error message.
 */
function formatDate(dateString) {
  if (!dateString) {
    return "Datum nicht verfügbar";
  }
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) {
    console.warn("Ungültiges Datumsformat:", dateString);
    return "Ungültiges Datum";
  }
  return `${day}/${month}/${year}`;
}


/**
 * Returns priority icon for a given priority text.
 * @param {string} priorityText - Priority level.
 * @returns {string} - Icon path.
 */
function getPriorityIcon(priorityText) {
  switch (priorityText.toLowerCase()) {
    case "low":
      return "../Assets/prio_low.png";
    case "medium":
      return "../Assets/prio_medium_orang.png";
    case "urgent":
      return "../Assets/prio_urgent.png";
    default:
      return "";
  }
}


/**
 * Formats priority display with text and icon.
 * @param {string} priorityText - Priority level.
 * @returns {string} - HTML string.
 */
function formatPriority(priorityText) {
  const priorityIcon = getPriorityIcon(priorityText);
  return `<span class="priority-text">${priorityText}</span> 
          <img src="${priorityIcon}" alt="${priorityText} Priority Icon" class="priority-icon">`;
}


/**
 * Renders assigned users as HTML.
 * @param {Array<{name: string, color: string}>} users - Assigned users.
 * @returns {string} - HTML string.
 */
function renderAssignedUsers(users) {
  return users
    .map(
      (user) => `
        <div class="user-item">
            <div class="user-avatar" style="background-color: ${user.color};">${
        user.name[0]
      }${user.name.split(" ")[1] ? user.name.split(" ")[1][0] : ""}</div>
            <span class="user-name">${user.name}</span>
        </div>`).join("");
}


/**
 * Retrieves category style.
 * @param {string} category - Category name.
 * @returns {Object} - Category text and class.
 */
function getCategoryStyle(category) {
  const categoryStyles = {
    "User Story": {
      text: "User Story",
      class: "user-story",},
    "Technical Task": {
      text: "Technical Task",
      class: "technical-task",},
  };
  return categoryStyles[category] || {
    text: "Uncategorized",
    class: "uncategorized",
  };
}


/**
 * Sets category style for an element.
 * @param {string} elementId - Element ID.
 * @param {string} category - Category name.
 */
function setCategoryStyle(elementId, category) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const style = getCategoryStyle(category);
  element.innerText = style.text;
  element.className = style.class;
}


/**
 * Opens task input page for a column.
 * @param {string} columnId - Column ID.
 */
function openInputPage(columnId) {
   localStorage.setItem("currentColumn", columnId);
   if (window.innerWidth <= 830) {
     window.location.href = "add-task.html";
     return;
     } 
     renderAddTask();
}


/**
 * Renders the add task input form.
 */
function renderAddTask() {
  let hero = document.getElementById("hero");
  hero.style.display = "flex";
}


/**
 * Toggles subtask completion status.
 * @param {string} taskId - Task ID.
 * @param {number} subtaskIndex - Subtask index.
 */
function toggleSubtaskCompletion(taskId, subtaskIndex) {
  const columnId = findTaskColumn(taskId);
  let tasks = getTasksFromStorage(columnId);
  if (!tasks) return;
  const task = findTaskById(tasks, taskId);
  if (!task) return;
  updateSubtaskCompletion(task, subtaskIndex);
  saveTasksToStorage(columnId, tasks);
  updateTaskElement(taskId, task);
}


/**
 * Retrieves tasks from local storage for a column.
 * @param {string} columnId - Column ID.
 * @returns {Array} - List of tasks.
 */
function getTasksFromStorage(columnId) {
  return JSON.parse(localStorage.getItem(columnId)) || [];
}


/**
 * Saves tasks to local storage.
 * @param {string} columnId - Column ID.
 * @param {Array} tasks - Task list.
 */
function saveTasksToStorage(columnId, tasks) {
  localStorage.setItem(columnId, JSON.stringify(tasks));
}


function findTaskById(tasks, taskId) {
  return tasks.find((t) => t.id === taskId);
}


function updateSubtaskCompletion(task, subtaskIndex) {
  if (!Array.isArray(task.completedSubtasks)) {
    task.completedSubtasks = [];
  }
  if (task.completedSubtasks.includes(subtaskIndex)) {
    task.completedSubtasks = task.completedSubtasks.filter(
      (i) => i !== subtaskIndex
    );
  } else {
    task.completedSubtasks.push(subtaskIndex);
  }
}


function updateTaskElement(taskId, task) {
  const taskElement = document.getElementById(taskId);
  if (taskElement) {
    taskElement.outerHTML = renderTask(task);
  }
}


/**
 * Finds the column ID for a given task.
 * @param {string} taskId - Task ID.
 * @returns {string|null} - Column ID or null.
 */
function findTaskColumn(taskId) {
  const columns = ["todo", "in-progress", "await-feedback", "done"];
  for (let column of columns) {
    let tasks = JSON.parse(localStorage.getItem(column)) || [];
    if (tasks.some((task) => task.id === taskId)) {
      return column;
    }
  }
  return null;
}

