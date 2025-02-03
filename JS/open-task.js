/**
 * Opens task details in a modal.
 * @param {string} taskId - Task ID.
 */
function openTaskDetails(taskId) {
  const tasks = getAllTasks();
  const task = findTaskById(tasks, taskId);
  if (task) {
    currentTaskId = taskId;
    updateModalContent(task);
    document.getElementById("taskModal").style.display = "block";
    toggleModalLayout(false);
    addSaveAndCancelButtons(false);
  }
}


/**
 * Retrieves all tasks from local storage.
 * @returns {Array} - List of tasks.
 */
function getAllTasks() {
  return [
    ...JSON.parse(localStorage.getItem("todo") || "[]"),
    ...JSON.parse(localStorage.getItem("in-progress") || "[]"),
    ...JSON.parse(localStorage.getItem("await-feedback") || "[]"),
    ...JSON.parse(localStorage.getItem("done") || "[]"),
  ];
}


/**
 * Finds a task by ID.
 * @param {string} taskId - Task ID.
 * @returns {Object|null} - Found task or null.
 */
function findTaskById(tasks, taskId) {
  return tasks.find((task) => task.id === taskId);
}


/**
 * Updates modal content with task details.
 * @param {Object} task - Task object.
 */
function updateModalContent(task) {
  updateModalCategory(task);
  updateModalTitleAndDescription(task);
  updateModalDueDate(task);
  updateModalPriority(task);
  updateModalAssignedUsers(task);
  updateModalSubtasks(task);
}


/**
 * Updates the category in the modal.
 * @param {Object} task - Task object.
 */
function updateModalCategory(task) {
  const modalCategory = document.getElementById("modalCategory");
  modalCategory.innerText = task.category || "No Category";
  modalCategory.className = `category-label ${task.categoryClass || ""}`;
  setCategoryStyle("modalCategory", task.category);
}


/**
 * Updates title and description in the modal.
 * @param {Object} task - Task object.
 */
function updateModalTitleAndDescription(task) {
  document.getElementById("modalTitle").innerText = task.title;
  document.getElementById("modalDescription").innerText = task.description;
}


/**
 * Updates the due date in the modal.
 * @param {Object} task - Task object.
 */
function updateModalDueDate(task) {
  const dueDateElement = document.getElementById("modalDueDate");
  dueDateElement.innerText = task.dueDate
    ? formatDate(task.dueDate)
    : "Kein Fälligkeitsdatum";
}


/**
 * Updates priority in the modal.
 * @param {Object} task - Task object.
 */
function updateModalPriority(task) {
  document.getElementById("modalPriority").innerHTML = formatPriority(
    task.priority
  );
}


/**
 * Updates assigned users in the modal.
 * @param {Object} task - Task object.
 */
function updateModalAssignedUsers(task) {
  document.getElementById("modalAssignedUsers").innerHTML = renderAssignedUsers(
    task.assignedUsers
  );
}


/**
 * Closes the task modal.
 */
function closeTaskModal() {
  document.getElementById("taskModal").style.display = "none";
}


/**
 * Deletes a task from local storage.
 */
function deleteTask() {
  const allColumns = ["todo", "in-progress", "await-feedback", "done"];
  allColumns.forEach((column) => {
    let tasks = JSON.parse(localStorage.getItem(column)) || [];
    tasks = tasks.filter((task) => task.id !== currentTaskId);
    localStorage.setItem(column, JSON.stringify(tasks));
    loadTasks(column);
  });
  closeTaskModal();
}


function closeTaskModal() {
  document.getElementById("taskModal").style.display = "none";
}


/**
 * Handles responsive button display.
 */
function addButton() {
  const headerBoard = document.getElementById("sectionBoard");
  const headerBoardPlus = document.getElementById("sectionBoardPlus");
  if (window.innerWidth < 1355) {
    headerBoard.classList.remove("hidden");
    headerBoardPlus.classList.add("hidden");
  } else {
    headerBoard.classList.add("hidden");
    headerBoardPlus.classList.remove("hidden");
  }
}


window.addEventListener("resize", addButton);
window.addEventListener("DOMContentLoaded", addButton);


/**
 * Enables dragging for tasks.
 * @param {Event} event - Drag event.
 */
function drag(event) {
  draggedTaskId = event.target.id;
  event.dataTransfer.effectAllowed = "move";
}


/**
 * Allows dropping tasks into columns.
 * @param {Event} event - Drop event.
 */
function allowDrop(event) {
  event.preventDefault();
  const taskContainer = event.target.closest(".task-container");
  if (taskContainer) {
    document
      .querySelectorAll(".task-container.highlight-drop")
      .forEach((container) => {
        container.classList.remove("highlight-drop");
      });
    taskContainer.classList.add("highlight-drop");
  }
}


/**
 * Removes highlight effect from drop areas.
 */
function removeHighlight() {
  document
    .querySelectorAll(".task-container.highlight-drop")
    .forEach((container) => {
      container.classList.remove("highlight-drop");
    });
}


/**
 * Handles dropping a task into a new column.
 * @param {Event} event - Drop event.
 */
function handleDrop(event) {
  event.preventDefault();
  const targetTaskContainer = getClosestTaskContainer(event.target);
  removeHighlight();
  if (targetTaskContainer && draggedTaskId) {
    const draggedTaskElement = document.getElementById(draggedTaskId);
    const sourceTaskContainer = getSourceTaskContainer(draggedTaskElement);
    if (draggedTaskElement && targetTaskContainer !== sourceTaskContainer) {
      processDrop(targetTaskContainer, draggedTaskElement, sourceTaskContainer);
    }
  }
}


/**
 * Processes the task drop action.
 * @param {HTMLElement} targetTaskContainer - Drop target.
 * @param {HTMLElement} draggedTaskElement - Dragged task.
 * @param {HTMLElement} sourceTaskContainer - Original column.
 */
function processDrop(
  targetTaskContainer,
  draggedTaskElement,
  sourceTaskContainer) {
  moveTaskInDOM(draggedTaskElement, targetTaskContainer);
  updateLocalStorage(
    sourceTaskContainer,
    targetTaskContainer,
    draggedTaskElement.id);
  refreshUI(sourceTaskContainer, targetTaskContainer);
}


/**
 * Gets the closest task container element.
 * @param {HTMLElement} element - Target element.
 * @returns {HTMLElement|null} - Closest task container.
 */
function getClosestTaskContainer(element) {
  return element.closest(".task-container");
}


/**
 * Finds the source task container for a dragged task.
 * @param {HTMLElement} draggedTaskElement - Dragged task.
 * @returns {HTMLElement|null} - Source container.
 */
function getSourceTaskContainer(draggedTaskElement) {
  return draggedTaskElement.closest(".task-container");
}


/**
 * Moves a task in the DOM.
 * @param {HTMLElement} draggedTaskElement - Dragged task.
 * @param {HTMLElement} targetTaskContainer - New container.
 */
function moveTaskInDOM(draggedTaskElement, targetTaskContainer) {
  targetTaskContainer.appendChild(draggedTaskElement);
}


/**
 * Updates local storage after task movement.
 * @param {HTMLElement} sourceTaskContainer - Original container.
 * @param {HTMLElement} targetTaskContainer - New container.
 * @param {string} taskId - Task ID.
 */
function updateLocalStorage(sourceTaskContainer, targetTaskContainer, taskId) {
  const sourceColumnId = sourceTaskContainer.closest(".column").id;
  const targetColumnId = targetTaskContainer.closest(".column").id;
  const sourceTasks = JSON.parse(localStorage.getItem(sourceColumnId)) || [];
  const targetTasks = JSON.parse(localStorage.getItem(targetColumnId)) || [];
  const taskIndex = sourceTasks.findIndex((task) => task.id === taskId);
  if (taskIndex > -1) {
    targetTasks.push(sourceTasks.splice(taskIndex, 1)[0]);
    localStorage.setItem(sourceColumnId, JSON.stringify(sourceTasks));
    localStorage.setItem(targetColumnId, JSON.stringify(targetTasks));
  }
}


/**
 * Refreshes UI after task movement.
 * @param {HTMLElement} sourceTaskContainer - Original container.
 * @param {HTMLElement} targetTaskContainer - New container.
 */
function refreshUI(sourceTaskContainer, targetTaskContainer) {
  const sourceColumnId = sourceTaskContainer.closest(".column").id;
  const targetColumnId = targetTaskContainer.closest(".column").id;
  loadTasks(sourceColumnId);
  loadTasks(targetColumnId);
}


document.querySelectorAll(".task-container").forEach((taskContainer) => {
  taskContainer.addEventListener("dragleave", removeHighlight);
});



/**
 * Calculates target column index based on movement direction.
 * @param {number} currentIndex - Current column index.
 * @param {string} direction - Move direction.
 * @param {number} columnCount - Total columns.
 * @returns {number|null} - Target index or null.
 */
function calculateTargetColumnIndex(currentIndex, direction, columnCount) {
  return direction === "left" && currentIndex > 0
    ? currentIndex - 1
    : direction === "right" && currentIndex < columnCount - 1
    ? currentIndex + 1
    : null;
}


/**
 * Processes task movement between columns.
 * @param {string} taskId - Task ID.
 * @param {string} direction - Move direction.
 */
function moveTask(taskId, direction, event) {
  if (event) event.stopPropagation();
  const columns = ["todo", "in-progress", "await-feedback", "done"];
  const tasks = getAllTasks();
  const task = findTaskById(tasks, taskId);
  if (!task) return;
  const currentColumnIndex = findCurrentColumnIndex(columns, taskId);
  const targetColumnIndex = calculateTargetColumnIndex(currentColumnIndex, direction, columns.length);
  if (targetColumnIndex === null) return;
  moveTaskBetweenColumns(taskId, task, columns[currentColumnIndex], columns[targetColumnIndex]);
  refreshUII(columns[currentColumnIndex], columns[targetColumnIndex]);
}



/**
 * Finds the current column index of a task.
 * @param {Array} columns - List of column IDs.
 * @param {string} taskId - Task ID.
 * @returns {number} - Column index.
 */
function findCurrentColumnIndex(columns, taskId) {
  return columns.findIndex((column) => {
    const columnTasks = JSON.parse(localStorage.getItem(column)) || [];
    return columnTasks.some((t) => t.id === taskId);
  });
}


function calculateTargetColumnIndex(currentIndex, direction, totalColumns) {
  let targetIndex =
    direction === "previous" ? currentIndex - 1 : currentIndex + 1;
  return targetIndex < 0 || targetIndex >= totalColumns ? null : targetIndex;
}


/**
 * Moves a task between columns.
 * @param {string} taskId - Task ID.
 * @param {Object} task - Task object.
 * @param {string} currentColumn - Source column ID.
 * @param {string} targetColumn - Destination column ID.
 */
function moveTaskBetweenColumns(taskId, task, currentColumn, targetColumn) {
  let currentTasks = JSON.parse(localStorage.getItem(currentColumn)) || [];
  currentTasks = currentTasks.filter((t) => t.id !== taskId);
  localStorage.setItem(currentColumn, JSON.stringify(currentTasks));
  let targetTasks = JSON.parse(localStorage.getItem(targetColumn)) || [];
  targetTasks.push(task);
  localStorage.setItem(targetColumn, JSON.stringify(targetTasks));
}

function refreshUII(currentColumn, targetColumn) {
  loadTasks(currentColumn);
  loadTasks(targetColumn);
}
