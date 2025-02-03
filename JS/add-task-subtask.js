let addSubtaskBtn = document.getElementById("add-subtask-btn");
let subtaskList = [];

/**
 * Schaltet die Sichtbarkeit von Schaltflächen basierend auf dem Eingabewert im Task-Input.
 * 
 * @param {boolean} forceShow - Ein Wert, der bestimmt, ob die Schaltflächen immer angezeigt werden sollen, 
 * unabhängig von der Eingabe im Task-Input.
 */
function toggleButtonVisibility(forceShow) {
    const taskInput = document.getElementById("newSubtask");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");
    const plusButton = document.getElementById("plusButton");
    const linie = document.getElementById("linie");
    linie.style.display = "none";
    confirmButton.style.display = "none";
    cancelButton.style.display = "none";
    plusButton.style.display = "inline";

    if (forceShow || taskInput.value.trim()) {
        confirmButton.style.display = "inline";
        cancelButton.style.display = "inline";
        linie.style.display = "inline";
        plusButton.style.display = "none";
    }
}

/**
* Fügt eine neue Unteraufgabe zur Liste hinzu und aktualisiert die Anzeige der Unteraufgaben.
*/
function addSubtask() {
    const taskInput = document.getElementById("newSubtask");
    const taskValue = taskInput.value.trim();
    if (taskValue === "") return;

    subtaskList.push(taskValue);
    renderSubtasks();

    taskInput.value = "";
    toggleButtonVisibility();
}

/**
 * Setzt die Eingabe für eine Unteraufgabe zurück und blendet die Schaltflächen aus.
 */
function cancelSubtask() {
    document.getElementById("newSubtask").value = "";
    toggleButtonVisibility();
}

/**
 * Rendert alle Unteraufgaben und zeigt sie im entsprechenden Container an.
 */
function renderSubtasks() {
    const subtaskContainer = document.getElementById("subtaskLabels");
    subtaskContainer.innerHTML = "";
    subtaskList.forEach((subtask, index) => {
        subtaskContainer.innerHTML += getSubtasksTemplate(subtask, index);
    });
}

/**
 * Aktiviert den Bearbeitungsmodus für eine Unteraufgabe, indem die entsprechenden Schaltflächen und Eingabefelder angezeigt werden.
 * 
 * @param {number} index - Der Index der Unteraufgabe, die bearbeitet werden soll.
 */
function editSubtask(index) {
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
 * Setzt den Fokus auf das Eingabefeld für die Bearbeitung der Unteraufgabe.
 * 
 * @param {number} index - Der Index der Unteraufgabe, deren Eingabefeld fokussiert werden soll.
 */
function inputOnFocus(index) {
    let editSubtask = document.getElementById(`edit-subtask-${index}`);
    let subtaskList = document.getElementById(`subtask-list-${index}`);
    let subtaskLabel = document.getElementById(`subtask-label-${index}`);
    let length = editSubtask.value.length;

    editSubtask.focus();
    editSubtask.setSelectionRange(length, length);
    editSubtask.style.backgroundColor = "white";
    subtaskLabel.style.backgroundColor = "white";
    subtaskList.style.borderBottom = "1px solid #29abe2";
}

/**
 * Bestätigt die Bearbeitung einer Unteraufgabe und aktualisiert die Liste.
 * 
 * @param {number} index - Der Index der Unteraufgabe, die bearbeitet werden soll.
 */
function confirmSubtask(index) {
    const editInput = document.getElementById(`edit-subtask-${index}`);
    const updatedValue = editInput.value.trim();

    if (updatedValue) {
        subtaskList[index] = updatedValue;
        renderSubtasks();
    }
}

/**
 * Setzt die Eingabe für eine Unteraufgabe zurück und blendet die Schaltflächen aus.
 * Diese Funktion wird aufgerufen, wenn der Benutzer die Erstellung oder Bearbeitung einer Unteraufgabe abbrechen möchte.
 */
function cancelSubtask() {
    subtaskInput.value = "";
    addSubtaskBtn.style.display = "inline";
    document.getElementById("confirm-subtask-btn").style.display = "none";
    document.getElementById("cancel-subtask-btn").style.display = "none";
}

/**
 * Löscht eine Unteraufgabe aus der Liste.
 * 
 * @param {number} index - Der Index der Unteraufgabe, die gelöscht werden soll.
 */
function deleteSubtask(index) {
    subtaskList.splice(index, 1);
    renderSubtasks();
}

/**
 * Ruft den Wert eines Eingabefelds ab.
 * 
 * @param {string} inputId - Die ID des Eingabefelds.
 * @returns {string} - Der bereinigte Wert des Eingabefelds.
 */
function getFormInputValue(inputId) {
    return document.getElementById(inputId).value.trim();
}

/**
 * Zählt die Gesamtanzahl und den Status der Unteraufgaben.
 * 
 * @param {Array} subtaskList - Die Liste der Unteraufgaben.
 * @returns {Object} - Ein Objekt, das die Anzahl der erledigten Unteraufgaben und die Gesamtzahl der Unteraufgaben enthält.
 */
function countSubtasks(subtaskList) {
    const totalSubtasks = subtaskList.length;
    const completedSubtasks = subtaskList.filter(
        (subtask) => subtask.completed
    ).length;
    return { completedSubtasks, totalSubtasks };
}