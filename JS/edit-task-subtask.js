/**
 * Retrieves subtasks and completed subtasks from a task.
 * @param {Object} task - Task object.
 * @returns {Object} - Subtasks and completed subtasks.
 */
function getTaskSubtasks(task) {
    if (!task) {
        console.error('Kein Task gefunden, um Subtasks anzuzeigen.');
        return { subtasks: [], completedSubtasks: [] };
    }
    return {
        subtasks: task.subtasks || [],
        completedSubtasks: task.completedSubtasks || []
    };
}


/**
 * Enables subtask editing in the modal.
 */
function enableSubtaskEdit() {
    const modalSubtasks = document.getElementById('modalSubtasks');
    const task = getCurrentTask();
    const { subtasks, completedSubtasks } = getTaskSubtasks(task);
    subtaskList = subtasks;
    completedSubtasktask = completedSubtasks;
    modalSubtasks.innerHTML = createAddSubtaskHTML();
    renderExistingSubtasks();
}


/**
 * Renders existing subtasks in the modal.
 */
function renderExistingSubtasks() {
    const subtaskListContainer = document.getElementById('subtaskList');
    subtaskListContainer.innerHTML = '';
    subtaskList.forEach((subtask, index) => {
        const isChecked = completedSubtasktask.includes(index);
        subtaskListContainer.insertAdjacentHTML('beforeend', generateSubtaskHTML(subtask, index, isChecked));
    });
}


/**
 * Updates the completion status of a subtask.
 * @param {Object} task - Task object.
 * @param {number} subtaskIndex - Index of the subtask.
 */
function updateSubtaskCompletion(task, subtaskIndex) {
    if (!Array.isArray(task.completedSubtasks)) {
        task.completedSubtasks = [];
    }
    if (task.completedSubtasks.includes(subtaskIndex)) {
        task.completedSubtasks = task.completedSubtasks.filter(i => i !== subtaskIndex);
    } else {
        task.completedSubtasks.push(subtaskIndex);
    }
}


/**
 * Toggles completion status of a subtask by its index.
 * @param {number} subtaskIndex - Index of the subtask.
 */
function toggleSubtaskIdCompletion(subtaskIndex) {
    const task = getCurrentTask();
    if (!task) return;
    updateSubtaskCompletion(task, subtaskIndex);
    updateTaskInLocalStorage(task);
    renderExistingSubtasks();
}


/**
 * Adds a new subtask to the list.
 */
function addSubtasks() {
    const newSubtaskInput = document.getElementById('newSubtask');
    const subtaskText = newSubtaskInput.value.trim();
    if (!subtaskText) {
        alert('Please enter a valid subtask!');
        return;
    }
    subtaskList.push(subtaskText);
    renderExistingSubtasks();
    newSubtaskInput.value = '';
    toggleButtonVisibility(false);
}


/**
 * Deletes a subtask by its index.
 * @param {number} index - Index of the subtask.
 */
function deleteSubtaskID(index) {
    subtaskList.splice(index, 1);
    completedSubtasktask = completedSubtasktask.filter(i => i !== index);
    completedSubtasktask = completedSubtasktask.map(i => (i > index ? i - 1 : i));
    const task = getCurrentTask();
    if (task) {
        task.subtasks = subtaskList;
        task.completedSubtasks = completedSubtasktask;
        updateTaskInLocalStorage(task);
    }
    renderExistingSubtasks();
}


/**
 * Enables editing mode for a subtask.
 * @param {number} index - Index of the subtask.
 */
function editSubtask(index) {
    const subtaskItem = document.getElementById(`subtask-${index}`);
    subtaskItem.innerHTML = generateEditSubtaskHTML(subtaskList[index], index);
}


/**
 * Saves the updated subtask text.
 * @param {number} index - Index of the subtask.
 */
function saveSubtask(index) {
    const editInput = document.getElementById(`editSubtaskInput-${index}`);
    const updatedText = editInput.value.trim();
    if (!updatedText) {
        alert('Please enter a valid subtask!');
        return;
    }
    subtaskList[index] = updatedText;
    renderExistingSubtasks();
}


/**
 * Cancels the editing of a subtask and restores the original text.
 * @param {number} index - Index of the subtask.
 * @param {string} originalText - Original subtask text.
 */
function cancelEditSubtask(index, originalText) {
    subtaskList[index] = originalText;
    renderExistingSubtasks();
}


/**
 * Cancels adding a new subtask.
 */
function cancelSubtask() {
    document.getElementById('newSubtask').value = '';
    toggleButtonVisibility(false);
}


/**
 * Displays or hides subtask progress based on task data.
 * @param {Object} task - Task object.
 */
function showSubtaskProgress(task) {
    const progressContainer = document.getElementById(`progress-bar-${task.id}`);
    if (!progressContainer) return;

    if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
        progressContainer.style.display = 'flex'; 
    } else {
        progressContainer.style.display = 'none';
    }
}


/**
 * Updates arrow icons for task movement.
 * @param {string} columnId - Column ID.
 * @param {string} taskId - Task ID.
 */
function updateArrowIcons(columnId, taskId) {
    const taskElement = document.getElementById(taskId);
    const arrowRightIcon = taskElement.querySelector(".arrow-right-icon");
    const arrowLeftIcon = taskElement.querySelector(".arrow-left-icon");
    if (columnId === "todo") {
      arrowRightIcon.style.display = "none";
    }
    if (columnId === "done") {
      arrowLeftIcon.style.display = "none";
    }
  }
  
  
  /**
   * Updates the subtasks section in the modal.
   * @param {Object} task - Task object.
   */
  function updateModalSubtasks(task) {
    const subtasksContainer = document.getElementById("modalSubtasks");
    if (!subtasksContainer) return;
    subtasksContainer.innerHTML = "";
    if (!Array.isArray(task.completedSubtasks)) {
      task.completedSubtasks = [];
    }
    if (!Array.isArray(task.subtasks) || task.subtasks.length === 0) {
      displayNoSubtasksMessage(subtasksContainer);
      return;
    }
    renderSubtasks(task, subtasksContainer);
  }
  
  
  /**
   * Displays a message when no subtasks exist.
   * @param {HTMLElement} container - Subtasks container.
   */
  function displayNoSubtasksMessage(container) {
    container.innerHTML = "<p>Keine Subtasks vorhanden</p>";
  }
  
  
  /**
   * Renders subtasks in the modal.
   * @param {Object} task - Task object.
   * @param {HTMLElement} container - Subtasks container.
   */
  function renderSubtasks(task, container) {
    task.subtasks.forEach((subtask, index) => {
      const subtaskElement = createSubtaskElement(task, subtask, index);
      container.appendChild(subtaskElement);
    });
  }
  
  
  /**
   * Creates a subtask element.
   * @param {Object} task - Task object.
   * @param {string} subtask - Subtask text.
   * @param {number} index - Subtask index.
   * @returns {HTMLElement} - Subtask element.
   */
  function createSubtaskElement(task, subtask, index) {
    const subtaskElement = document.createElement("div");
    subtaskElement.classList.add("subtask-item");
    const checkbox = createCheckbox(task, index);
    const subtaskText = createSubtaskText(subtask);
    subtaskElement.appendChild(checkbox);
    subtaskElement.appendChild(subtaskText);
    return subtaskElement;
  }
  
  
  /**
   * Creates a checkbox for a subtask.
   * @param {Object} task - Task object.
   * @param {number} index - Subtask index.
   * @returns {HTMLElement} - Checkbox element.
   */
  function createCheckbox(task, index) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completedSubtasks.includes(index);
    checkbox.addEventListener("change", () =>
      toggleSubtaskCompletion(task.id, index)
    );
    return checkbox;
  }
  
  
  /**
   * Creates a text element for a subtask.
   * @param {string} subtask - Subtask text.
   * @returns {HTMLElement} - Subtask text element.
   */
  function createSubtaskText(subtask) {
    const subtaskText = document.createElement("span");
    subtaskText.textContent = subtask;
    subtaskText.style.marginLeft = "10px";
    return subtaskText;
  }
  

  /**
 * Displays an error message inside a container.
 * @param {HTMLElement} container - Target container.
 * @param {string} message - Error message.
 */
function showErrorMessage(container, message) {
    removeError(container);
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.textContent = message;
    container.appendChild(errorElement);
}


/**
 * Removes an error message from a container.
 * @param {HTMLElement} container - Target container.
 */
function removeError(container) {
    const existingError = container.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}


/**
 * Validates modal input fields.
 * @returns {boolean} - Validation result.
 */
function validateModalInputs() {
    let isValid = true;
    ['editTitle', 'editDescription'].forEach(id => {
        const input = document.getElementById(id);
        const container = input.parentElement;
        if (!input.value.trim()) {
            isValid = false;
            showErrorMessage(container, id === 'editTitle' ? "Bitte fügen Sie einen Titel hinzu" : "Bitte fügen Sie eine Beschreibung hinzu");
        } else {
            removeError(container);
        }
    });
    return isValid;
}


/**
 * Removes validation error messages.
 * @param {HTMLElement} container - Target container.
 */
function removeError(container) {
    const error = container.querySelector('.error-message');
    if (error) error.remove();
}
