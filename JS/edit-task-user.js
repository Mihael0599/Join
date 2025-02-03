/**
 * Enables user editing in the modal.
 */
function enableUserEdit() {
    const modalAssignedUsers = document.getElementById('modalAssignedUsers');
    modalAssignedUsers.innerHTML = generateUserEditHTML();
    renderDropdownUsers(loadedContacts, selectedUsers);
}


/**
 * Retrieves the current task based on task ID.
 * @returns {Object|null} - Task object or null.
 */
function getCurrentTask() {
    const columns = ['todo', 'in-progress', 'await-feedback', 'done'];
    for (const column of columns) {
        const tasks = JSON.parse(localStorage.getItem(column)) || [];
        const task = tasks.find(task => task.id === currentTaskId);
        if (task) {
            return task;
        }
    }
    return null;
}


document.addEventListener('DOMContentLoaded', () => {
    renderDropdownUsers(loadedContacts, selectedUsers);
    addedUsers();
});


/**
 * Clears the contact list in the dropdown.
 */
function clearContactList() {
    const contactList = document.getElementById('contactList');
    if (contactList) {
        contactList.innerHTML = "";
    } else {
        console.error("Das Element 'contactList' wurde nicht gefunden!");
    }
}


/**
 * Checks if a user is selected.
 * @param {Object} user - User object.
 * @param {Array} selectedUsers - List of selected users.
 * @returns {boolean} - True if selected, false otherwise.
 */
function isUserSelected(user, selectedUsers) {
    return selectedUsers.some(selected => selected.name === user.name);
}


/**
 * Renders the list of users in the dropdown.
 * @param {Array} loadedContacts - List of contacts.
 * @param {Array} selectedUsers - List of selected users.
 */
function renderUserList(loadedContacts, selectedUsers) {
    const contactList = document.getElementById('contactList');
    if (!contactList) return;
    loadedContacts.forEach((user, index) => {
        const isChecked = isUserSelected(user, selectedUsers);
        const userElement = createUserElement(user, index, isChecked);
        contactList.innerHTML += userElement;
    });
}


/**
 * Updates and renders the user dropdown list.
 * @param {Array} loadedContacts - List of contacts.
 * @param {Array} selectedUsers - List of selected users.
 */
function renderDropdownUsers(loadedContacts, selectedUsers) {
    clearContactList();
    renderUserList(loadedContacts, selectedUsers);
}


/**
 * Extracts initials from a user's name.
 * @param {string} name - Full name.
 * @returns {string} - Initials.
 */
function getInitials(name) {
    const nameParts = name.trim().split(' ');
    if (nameParts.length > 1) {
        return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
}


/**
 * Adds a user to the selected users list.
 * @param {string} userName - User's name.
 * @param {string} userColor - User's color.
 */
function addUserToTask(userName, userColor) {
    if (!userName || !userColor) {
        console.error("Fehler: Benutzername oder Farbe fehlen!");
        return;
    }
    selectedUsers.push({ name: userName, color: userColor });
    renderAssignedUsers(selectedUsers);
}


/**
 * Toggles user selection in the dropdown.
 * @param {Object} user - User object.
 * @param {HTMLElement} checkbox - Checkbox element.
 * @param {HTMLElement} contactElement - Contact list element.
 */
function toggleUserSelection(user, checkbox, contactElement) {
    if (checkbox.checked) {
        if (!selectedUsers.some(u => u.name === user.name)) {
            selectedUsers.push(user);
            contactElement.classList.add('checked');
        }
    } else {
        selectedUsers = selectedUsers.filter(u => u.name !== user.name);
        contactElement.classList.remove('checked');
    }
}


/**
 * Handles user selection via checkbox interaction.
 * @param {number} index - User index in the list.
 * @param {Event} event - Click event.
 */
function checkBoxUserTask(index, event) {
    if (event && event.target.tagName === "INPUT") {
        event.stopPropagation();
    }
    const user = loadedContacts[index];
    const contactElement = document.querySelectorAll('.contact')[index];
    const checkbox = document.querySelectorAll('.contact input[type="checkbox"]')[index];
    if (!event || event.target.tagName !== "INPUT") {
        checkbox.checked = !checkbox.checked;
    }
    toggleUserSelection(user, checkbox, contactElement);
    addedUsers();
}


/**
 * Renders user avatars for assigned users.
 */
function renderUserAvatars() {
    const addedUsersContainer = document.getElementById("addedUsers");
    addedUsersContainer.innerHTML = ""; 
    selectedUsers.slice(0, 4).forEach(user => {
        const nameParts = user.name.split(' ');
        const initials = nameParts.length > 1 
            ? nameParts[0][0] + nameParts[1][0]
            : nameParts[0][0];      
        addedUsersContainer.innerHTML += `
            <div class="user-avatar" style="background-color: ${user.color};">
                ${initials.toUpperCase()}
            </div>`;
    });
}


/**
 * Displays the count of remaining users if more than four are selected.
 */
function renderRemainingUsersCount() {
    if (selectedUsers.length > 4) {
        document.getElementById("addedUsers").innerHTML += `
            <div class="user-avatar remaining-users-circle">
                +${selectedUsers.length - 4}
            </div>
        `;
    }
}


/**
 * Updates and displays selected users' avatars.
 */
function addedUsers() {
    renderUserAvatars();
    renderRemainingUsersCount();
}


/**
 * Toggles the visibility of the user dropdown menu.
 */
function openDropDownMenuUser() {
    const contactList = document.getElementById('contactList');
    const dropDownArrowContacts = document.getElementById('drop-down-arrow-contacts');
    if (contactList.style.display === 'none' || !contactList.style.display) {
        contactList.style.display = 'block';
        dropDownArrowContacts.src = "../Assets/arrow_drop_downaa.png";
    } else {
        contactList.style.display = 'none';
        dropDownArrowContacts.src = "../Assets/arrow_drop_downaa (1).png";
    }
}


/**
 * Gathers selected users' data for storage.
 * @returns {Array<Object>} - List of selected users.
 */
function gatherSelectedUsers() {
    return selectedUsers.map(user => ({
        name: user.name,
        color: user.color,
    }));
}


/**
 * Finds a task's column and index in local storage.
 * @param {string} taskId - Task ID.
 * @returns {Object|null} - Task column info.
 */
function getTaskColumnAndIndex(taskId) {
    const columns = ['todo', 'in-progress', 'await-feedback', 'done'];
    for (const column of columns) {
        let tasks = JSON.parse(localStorage.getItem(column)) || [];
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) {
            return { column, taskIndex, tasks };
        }
    }
    return null;
}


/**
 * Updates a task in local storage.
 * @param {Object} updatedTask - Updated task data.
 */
function updateTaskInLocalStorage(updatedTask) {
    const taskData = getTaskColumnAndIndex(updatedTask.id);
    if (taskData) {
        const { column, taskIndex, tasks } = taskData;
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updatedTask,
            completedSubtasks: updatedTask.completedSubtasks 
        };
        localStorage.setItem(column, JSON.stringify(tasks));
    }
}


/**
 * Reloads task details in the modal.
 */
function reloadTaskDetails() {
    closeTaskModal();
    openTaskDetails(currentTaskId);
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
 * Toggles class names for elements.
 * @param {HTMLElement} element - Target element.
 * @param {string} removeClass - Class to remove.
 * @param {string} addClass - Class to add.
 */
function toggleClass(element, removeClass, addClass) {
    if (element) {
        element.classList.remove(removeClass);
        element.classList.add(addClass);
    }
}


/**
 * Toggles modal layout between view and edit mode.
 * @param {boolean} isEditMode - Edit mode flag.
 */
function toggleModalLayout(isEditMode) {
    const dueDateElement = document.querySelector('.modalDueDate, .modalsDueDate');
    const priorityElement = document.querySelector('.modalPriority, .modalsPriority');
    if (dueDateElement && priorityElement) {
        toggleClass(dueDateElement, isEditMode ? 'modalDueDate' : 'modalsDueDate', isEditMode ? 'modalsDueDate' : 'modalDueDate');
        toggleClass(priorityElement, isEditMode ? 'modalPriority' : 'modalsPriority', isEditMode ? 'modalsPriority' : 'modalPriority');
    }
}
