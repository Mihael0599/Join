/**
 * Enables task editing mode in the modal.
 */
function editTaskDetails() {
    document.getElementById('modalCategory').classList.add('hidden');
    enableTitleEdit();
    enableDescriptionEdit();
    enableDueDateEdit();
    enablePriorityEdit();
    const task = getCurrentTask(); 
    selectedUsers = task.assignedUsers || [];
    enableUserEdit();
    addedUsers();
    enableSubtaskEdit();
    addSaveAndCancelButtons(true);
    toggleModalLayout(true); 
}


/**
 * Enables title editing in the modal.
 */
function enableTitleEdit() {
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.innerHTML = generateTitleEditHTML(modalTitle.innerText);
}


/**
 * Enables description editing in the modal.
 */
function enableDescriptionEdit() {
    const modalDescription = document.getElementById('modalDescription');
    modalDescription.innerHTML = generateDescriptionEditHTML(modalDescription.innerText);
}


/**
 * Enables due date editing in the modal.
 */
function enableDueDateEdit() {
    const modalDueDate = document.getElementById('modalDueDate');
    modalDueDate.innerHTML = generateDueDateEditHTML(modalDueDate.innerText);
}


/**
 * Formats a date string for input fields.
 * @param {string} dateText - Date string.
 * @returns {string} - Formatted date.
 */
function formatDateForInput(dateText) {
    const parts = dateText.split('/');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : '';
}


/**
 * Enables priority editing in the modal.
 */
function enablePriorityEdit() {
    const modalPriority = document.getElementById('modalPriority');
    const currentPriority = modalPriority.innerText.trim().toLowerCase();
    modalPriority.innerHTML = generatePriorityButtons(currentPriority);
    changeColorPrioBtn(currentPriority);
}


/**
 * Sets priority button styles.
 * @param {string} priority - Priority level.
 */
function setPriorityStyles(priority) {
    const imgSources = {
        urgent: ["../Assets/prio_arrow_white.png", "../Assets/prio_medium_Basis.png", "../Assets/prio_low.png"],
        medium: ["../Assets/prio_urgent.png", "../Assets/prio_medium.png", "../Assets/prio_low.png"],
        low: ["../Assets/prio_urgent.png", "../Assets/prio_medium_Basis.png", "../Assets/prio_arrowDown_white.png"]
    };
    const bgColors = {
        urgent: '#FF3B30',
        medium: '#FFA800',
        low: '#4CD964'
    };
    setButtonStyles(priority, bgColors[priority]);
    setImageSources(imgSources[priority]);
}


/**
 * Changes the color of the selected priority button.
 * @param {string} priority - Selected priority.
 */
function changeColorPrioBtn(priority) {
    resetButtonStyles();
    selectedPriority = priority;
    setPriorityStyles(priority);
}


/**
 * Resets styles of priority buttons.
 */
function resetButtonStyles() {
    const buttons = ['btn-urgent', 'btn-medium', 'btn-low'];
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        button.style.backgroundColor = '#ffffff';
        button.classList.remove('active');
    });
}


/**
 * Sets button background color based on priority.
 * @param {string} priority - Priority level.
 * @param {string} bgColor - Background color.
 */
function setButtonStyles(priority, bgColor) {
    const buttonId = `btn-${priority}`;
    const button = document.getElementById(buttonId);
    if (button) {
        button.style.backgroundColor = bgColor;
        button.classList.add('active');
    }
}


/**
 * Updates priority icon sources.
 * @param {Array<string>} imgSources - Icon sources.
 */
function setImageSources([urgentImgSrc, mediumImgSrc, lowImgSrc]) {
    document.getElementById("urgent-img").src = urgentImgSrc;
    document.getElementById("medium-img").src = mediumImgSrc;
    document.getElementById("low-img").src = lowImgSrc;
}


/**
 * Updates a task in local storage.
 * @param {Object} task - Updated task object.
 */
function updateTaskInLocalStorage(task) {
    const columns = ['todo', 'in-progress', 'await-feedback', 'done']; 
    for (const column of columns) {
        const tasks = JSON.parse(localStorage.getItem(column)) || [];
        const taskIndex = tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = task;
            localStorage.setItem(column, JSON.stringify(tasks));
            break;
        }
    }
}


/**
 * Saves the selected priority to the task.
 */
function savePriority() {
    const task = getCurrentTask();
    task.priority = selectedPriority;
    updateTaskInLocalStorage(task);
}


/**
 * Enables user editing when the page loads.
 */
document.addEventListener("DOMContentLoaded", () => {
    enableUserEdit();
});


/**
 * Resets button visibility for subtask actions.
 */
function resetButtonVisibility() {
    document.getElementById('linie').style.display = 'none';
    document.getElementById('confirmButton').style.display = 'none';
    document.getElementById('cancelTask').style.display = 'none';
    document.getElementById('plusButton').style.display = 'inline';
}


/**
 * Toggles visibility of subtask buttons.
 * @param {boolean} forceShow - Force button visibility.
 */
function toggleButtonVisibility(forceShow) {
    const taskInput = document.getElementById('newSubtask');
    resetButtonVisibility();
    if (forceShow || taskInput.value.trim()) {
        document.getElementById('confirmButton').style.display = 'inline';
        document.getElementById('cancelTask').style.display = 'inline';
        document.getElementById('linie').style.display = 'inline';
        document.getElementById('plusButton').style.display = 'none';
    } 
}


/**
 * Closes the task modal.
 */
function closeTaskModal() {
    const modalFooter = document.querySelector('.modal-footer');
    if (modalFooter) {
        modalFooter.innerHTML = '';
    }
    document.getElementById('taskModal').style.display = 'none';
}


/**
 * Adds save and cancel buttons to the modal footer.
 * @param {boolean} isEditMode - Determines button type.
 */
function addSaveAndCancelButtons(isEditMode) {
    const modalFooter = document.querySelector('.modal-footer');
    if (!modalFooter) {
        console.error('Element ".modal-footer" nicht gefunden!');
        return;
    }
    if (isEditMode) {
        modalFooter.innerHTML = createSaveButtonHTML();
    } else {
        modalFooter.innerHTML = createEditAndDeleteButtonsHTML();
    }
}


/**
 * Saves changes made to a task.
 */
function saveTaskChanges() {
    if (!validateModalInputs()) return;
    const updatedTask = gatherUpdatedTaskDetails();
    updateTaskInLocalStorage(updatedTask);
    refreshBoard();
    closeTaskModal();
}


/**
 * Refreshes the task board UI.
 */
function refreshBoard() {
    ['todo', 'in-progress', 'await-feedback', 'done'].forEach(loadTasks);
}


/**
 * Collects updated task details from the modal.
 * @returns {Object} - Updated task object.
 */
function gatherUpdatedTaskDetails() {
    return {
        id: getCurrentTaskId(),
        title: getUpdatedTitle(),
        description: getUpdatedDescription(),
        dueDate: getUpdatedDueDate(),
        assignedUsers: getUpdatedUsers(),
        priority: getUpdatedPriority(),
        subtasks: getUpdatedSubtasks(),
        completedSubtasks: getCompletedSubtasksCount()
    };
}


/**
 * Retrieves the current task ID.
 * @returns {string} - Task ID.
 */
function getCurrentTaskId() {
    return currentTaskId;
}


/**
 * Gets the updated task title from the input field.
 * @returns {string} - Updated title.
 */
function getUpdatedTitle() {
    return getInputValueById('editTitle');
}


/**
 * Gets the updated task description from the input field.
 * @returns {string} - Updated description.
 */
function getUpdatedDescription() {
    return getInputValueById('editDescription');
}


/**
 * Gets the updated task due date from the input field.
 * @returns {string} - Updated due date.
 */
function getUpdatedDueDate() {
    return getInputValueById('editDueDate');
}


/**
 * Gets the updated assigned users.
 * @returns {Array} - List of selected users.
 */
function getUpdatedUsers() {
    return gatherSelectedUsers();
}


/**
 * Gets the updated priority level.
 * @returns {string} - Selected priority.
 */
function getUpdatedPriority() {
    return selectedPriority || 'medium';
}


/**
 * Gets the updated list of subtasks.
 * @returns {Array} - Updated subtasks.
 */
function getUpdatedSubtasks() {
    return gatherSubtasks();
}


/**
 * Counts the number of completed subtasks.
 * @returns {number} - Completed subtask count.
 */
function getCompletedSubtasksCount() {
    return countCompletedSubtasks(getUpdatedSubtasks());
}


/**
 * Retrieves input value by ID.
 * @param {string} elementId - Element ID.
 * @returns {string} - Input value.
 */
function getInputValueById(elementId) {
    const inputElement = document.getElementById(elementId);
    if (!inputElement) {
        console.error(`Element mit ID "${elementId}" nicht gefunden!`);
        return '';
    }
    return inputElement.value;
}


/**
 * Gathers all subtasks from the modal.
 * @returns {Array} - Subtask list.
 */
function gatherSubtasks() {
    return subtaskList.map(subtask => subtask);
}


/**
 * Counts completed subtasks in the modal.
 * @param {Array} subtasks - Subtask list.
 * @returns {Array<number>} - Indices of completed subtasks.
 */
function countCompletedSubtasks(subtasks) {
    return subtasks
        .map((_, index) => index) 
        .filter(index => document.getElementById(`subtask-checkbox-${index}`)?.checked); 
}
