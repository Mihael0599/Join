let addSubtaskBtn = document.getElementById("add-subtask-btn");
let subtaskListOverlay = [];

/**
 * Schaltet die Sichtbarkeit von Schaltflächen und Eingabefeldern für die Unteraufgaben ein oder aus.
 * @param {boolean} forceShow - Wenn wahr, werden die Schaltflächen immer angezeigt, auch wenn das Eingabefeld leer ist.
 */
function toggleButtonVisibilityOverlay(forceShow) {
    const taskInputOverlay = document.getElementById("newSubtaskOverlay");
    const confirmButtonOverlay = document.getElementById("confirmButton-overlay");
    const cancelButtonOverlay = document.getElementById("cancelButton-overlay");
    const plusButtonOverlay = document.getElementById("confirm-subtask-btn-overlay");
    const linieOverlay = document.getElementById("linie-overlay");
    linieOverlay.style.display = "none";
    confirmButtonOverlay.style.display = "none";
    cancelButtonOverlay.style.display = "none";
    plusButtonOverlay.style.display = "inline";

    if (forceShow || taskInputOverlay.value.trim()) {
        confirmButtonOverlay.style.display = "inline";
        cancelButtonOverlay.style.display = "inline";
        linieOverlay.style.display = "inline";
        plusButtonOverlay.style.display = "none";
    }
}

/**
* Fügt eine neue Unteraufgabe hinzu, wenn das Eingabefeld nicht leer ist, und rendert die Liste.
*/
function addSubtask() {
    const taskInput = document.getElementById("newSubtaskOverlay");
    const taskValue = taskInput.value.trim();
    if (taskValue === "") return;

    subtaskListOverlay.push(taskValue);
    renderSubtasksOverlay();

    taskInput.value = "";
    toggleButtonVisibilityOverlay();
}

/**
 * Setzt das Eingabefeld für die Unteraufgabe zurück und blendet die Schaltflächen aus.
 */
function cancelSubtaskOverlay() {
    document.getElementById("newSubtaskOverlay").value = "";
    toggleButtonVisibilityOverlay();
}

/**
 * Rendert die Liste der Unteraufgaben im Overlay.
 */
function renderSubtasksOverlay() {
    const subtaskContainer = document.getElementById("subtaskLabels");
    if (subtaskContainer) {
        subtaskContainer.innerHTML = "";
        subtaskListOverlay.forEach((subtask, index) => {
            subtaskContainer.innerHTML += getSubtasksTemplateOverlay(subtask, index);
        });
    }
}

/**
 * Wechselt den Bearbeitungsmodus für eine Unteraufgabe und zeigt das Bearbeitungs-UI an.
 * @param {number} index - Der Index der zu bearbeitenden Unteraufgabe.
 */
function editSubtaskOverlay(index) {
    let editSubtaks = document.getElementById(`edit-subtask-img-${index}`);
    let deleteSubtask = document.getElementById(`delete-subtask-${index}`);
    let imagesContainer = document.getElementById(`images-container-${index}`);
    let confrimEdit = document.getElementById(`confirm-subtask-${index}`);

    editSubtaks.style.display = "none";
    confrimEdit.style.display = "flex";
    deleteSubtask.src = "../Assets/delete.png";
    imagesContainer.style.flexDirection = "row-reverse";

    inputOnFocus(index);
}

/**
 * Setzt den Fokus auf das Eingabefeld der Unteraufgabe, um die Bearbeitung zu erleichtern.
 * @param {number} index - Der Index der Unteraufgabe, die bearbeitet wird.
 */
function inputOnFocus(index) {
    let editSubtaskOverlay = document.getElementById(`edit-subtask-${index}`);
    let subtaskListOverlay = document.getElementById(`subtask-list-${index}`);
    let subtaskLabel = document.getElementById(`subtask-label-${index}`);
    let length = editSubtaskOverlay.value.length;

    editSubtaskOverlay.focus();
    editSubtaskOverlay.setSelectionRange(length, length);
    editSubtaskOverlay.style.backgroundColor = "white";
    subtaskLabel.style.backgroundColor = "white";
    subtaskListOverlay.style.borderBottom = "1px solid #29abe2";
}

/**
 * Bestätigt die Bearbeitung einer Unteraufgabe und aktualisiert die Liste der Unteraufgaben.
 * @param {number} index - Der Index der Unteraufgabe, die aktualisiert wird.
 */
function confirmSubtask(index) {
    const editInput = document.getElementById(`edit-subtask-${index}`);
    const updatedValue = editInput.value.trim();

    if (updatedValue) {
        subtaskListOverlay[index] = updatedValue;
        renderSubtasksOverlay();
    }
}

/**
 * Löscht eine Unteraufgabe aus der Liste.
 * @param {number} index - Der Index der zu löschenden Unteraufgabe.
 */
function deleteSubtask(index) {
    subtaskListOverlay.splice(index, 1);
    renderSubtasksOverlay();
}

/**
 * Gibt den Wert des Formular-Eingabefelds mit der angegebenen ID zurück.
 * @param {string} inputId - Die ID des Eingabefelds.
 * @returns {string} Der Wert des Eingabefelds, der getrimmt wurde.
 */
function getFormInputValue(inputId) {
    return document.getElementById(inputId).value.trim();
}

/**
 * Zählt die Anzahl der Unteraufgaben und der erledigten Unteraufgaben.
 * @param {Array} subtaskListOverlay - Die Liste der Unteraufgaben.
 * @returns {Object} Ein Objekt mit der Anzahl der erledigten und der insgesamt vorhandenen Unteraufgaben.
 */
function countSubtasks(subtaskListOverlay) {
    const totalSubtasks = subtaskListOverlay.length;
    const completedSubtasks = subtaskListOverlay.filter(
        (subtask) => subtask.completed
    ).length;
    return { completedSubtasks, totalSubtasks };
}
