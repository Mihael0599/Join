/**
 * Speichert die Kontakte im lokalen Speicher.
 * Die Funktion konvertiert das `loadedContacts`-Array in einen JSON-String 
 * und speichert es unter dem Schlüssel 'contacts' im lokalen Speicher.
 */
function saveContactsToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(loadedContacts));
}

/**
 * Rendert die Kontakte und zeigt sie im DOM an.
 * Diese Funktion zeigt alle Kontakte an, sortiert nach Namen und gruppiert nach dem ersten Buchstaben.
 */
function renderContacts() {
    let contentRef = document.getElementById('contacts');
    if (!contentRef) return;
    contentRef.innerHTML = "";
    loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
    let currentLetter = "";
    for (let index = 0; index < loadedContacts.length; index++) {
        const contact = loadedContacts[index];
        currentLetter = updateCurrentLetter(contact.name, currentLetter, contentRef);
        renderContactGroup(contact, currentLetter, index);
    }
    addBackgrounds();
    renderContactDetailPage();
}

/**
 * Aktualisiert den aktuellen Buchstaben für die Gruppierung der Kontakte.
 * @param {string} name - Der Name des Kontakts.
 * @param {string} currentLetter - Der aktuelle Buchstabe der Gruppe.
 * @param {HTMLElement} contentRef - Das Referenzelement im DOM, das aktualisiert wird.
 * @returns {string} - Der aktualisierte Buchstabe.
 */
function updateCurrentLetter(name, currentLetter, contentRef) {
    let firstLetter = name.slice(0, 1).toUpperCase();
    if (firstLetter !== currentLetter) {
        currentLetter = firstLetter;
        contentRef.innerHTML += renderCurrentLetter(currentLetter);
    }
    return currentLetter;
}

/**
 * Rendert die Kontakte innerhalb einer Gruppe basierend auf dem aktuellen Buchstaben.
 * @param {Object} contact - Der Kontakt, der gerendert werden soll.
 * @param {string} currentLetter - Der aktuelle Buchstabe der Gruppe.
 * @param {number} index - Der Index des Kontakts in der Liste.
 */
function renderContactGroup(contact, currentLetter, index) {
    const groupElement = document.getElementById(`contact-container-${currentLetter}`);
    const initialien = contact.initialien.toUpperCase();
    groupElement.innerHTML += renderCurrentContacts(index, initialien);
}

/**
 * Fügt zufällig generierte Hintergrundfarben zu den Avataren der Kontakte hinzu.
 */
function addBackgrounds() {
    const avatars = document.querySelectorAll('.contact-avatar');
    avatars.forEach(avatar => {
        avatar.style.backgroundColor = getRandomColor();
    });
}

/**
 * Gibt eine zufällige Hintergrundfarbe aus einer vordefinierten Liste zurück.
 * @returns {string} - Die zufällig ausgewählte Farbe.
 */
function getRandomColor() {
    const colors = ['#6A8EAE','#F4A261', '#2A9D8F', '#E76F51', '#264653', '#A2678A','#457B9D', '#D4A373', '#8A817C', '#BC6C25'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Öffnet das Overlay mit den Details eines Kontakts.
 * @param {number} index - Der Index des Kontakts, dessen Details angezeigt werden sollen.
 */
function openContactDetailsOverlay(index){
    const allContacts = document.querySelectorAll('[id^="contact-id-"]');
    allContacts.forEach(contact => {
        contact.classList.remove('darkgray-bg');
    });
    if (window.innerWidth < 1180) {
        document.getElementById('contacts').classList.add('d-none');
        let contentRef = document.getElementById('contact-details-wrapper-id');
        contentRef.classList.remove('contact-detail-hidden');
        contentRef.innerHTML = HTMLopenContactDetailsOverlayMobile(index);  
        let content = document.getElementById('edit-contact-details-overlay-id');
        content.innerHTML = HTMLEditOverlay(index);
    }else{
        let contentRef = document.getElementById('contact-details-wrapper-id');
        contentRef.innerHTML = HTMLopenContactDetailsOverlay(index);  
        let content = document.getElementById('edit-contact-details-overlay-id');
        content.innerHTML = HTMLEditOverlayDesktop(index);
    } 
    document.getElementById(`contact-id-${index}`).classList.add('darkgray-bg');
}

/**
 * Schließt das Overlay mit den Kontaktdetails und zeigt die Kontaktübersicht wieder an.
 */
function closeContactDetailsOverlay(){
    document.getElementById('contacts').classList.remove('d-none');
    let contentRef = document.getElementById('contact-details-wrapper-id');
    contentRef.classList.add('contact-detail-hidden');
    renderContactDetailPage();
    const allContacts = document.querySelectorAll('[id^="contact-id-"]');
    allContacts.forEach(contact => {
        contact.classList.remove('darkgray-bg');
    });
    
}

/**
 * Öffnet das Overlay zum Hinzufügen eines neuen Kontakts.
 */
function OpenAddContactOverlay(){
    document.getElementById('add-contact-div-overlay-id').classList.remove('d-none');
    if(window.innerWidth <1180){
        document.getElementById('add-contact-div-overlay-id').innerHTML = HTMLOpenAddContactOverlay();
    }else{
        document.getElementById('add-contact-div-overlay-id').innerHTML = HTMLOpenAddContactOverlayDesktop();
    }
}

/**
 * Schließt das Overlay zum Hinzufügen eines neuen Kontakts.
 */
function closeAddContactOverlay(){
    document.getElementById('add-contact-div-overlay-id').classList.add('d-none');
}

/**
 * Fügt einen neuen Kontakt hinzu, nachdem die Eingabefelder validiert wurden.
 * Wenn der Kontakt erfolgreich hinzugefügt wurde, wird er gespeichert und die Kontaktliste neu gerendert.
 */
function addNewContact() {
    let name = document.getElementById('add-input-name-id').value;
    let mail = document.getElementById('add-input-mail-id').value;
    let phone = document.getElementById('add-input-phone-id').value;
    if (validateName(name) && validateEmail(mail) && validatePhone(phone)) {
        loadedContacts.push(createNewContact(name, mail, phone));
        saveContactsToLocalStorage();
        renderContacts();
        closeAddContactOverlay();
        startAnimation();
    }
}

/**
 * Validiert einen Namen.
 * Der Name muss nur Buchstaben und Leerzeichen enthalten.
 * @param {string} name - Der Name, der validiert werden soll.
 * @returns {boolean} - Gibt `true` zurück, wenn der Name gültig ist, andernfalls `false`.
 */
function validateName(name) {
    const regex = /^[a-zA-ZäöüßÄÖÜéèêñáàäâëç\s]+$/u;
    let error = document.getElementById('name-error');
    error.innerHTML = regex.test(name) ? "" : "Bitte einen gültigen Namen eingeben";
    return regex.test(name);
}

/**
 * Validiert eine E-Mail-Adresse.
 * Die E-Mail muss dem Standard-Format entsprechen: `beispiel@domain.com`.
 * @param {string} mail - Die E-Mail-Adresse, die validiert werden soll.
 * @returns {boolean} - Gibt `true` zurück, wenn die E-Mail gültig ist, andernfalls `false`.
 */
function validateEmail(mail) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let error = document.getElementById('mail-error');
    error.innerHTML = regex.test(mail) ? "" : "ungültiges Email Format";
    return regex.test(mail);
}

/**
 * Validiert eine Telefonnummer.
 * Die Telefonnummer muss mindestens 8 Ziffern lang sein, wenn sie nicht leer ist.
 * @param {string} phone - Die Telefonnummer, die validiert werden soll.
 * @returns {boolean} - Gibt `true` zurück, wenn die Telefonnummer gültig ist, andernfalls `false`.
 */
function validatePhone(phone) {
    const phoneError = document.getElementById('phone-error');
    phoneError.innerHTML = "";

    if (phone === "") {
        return true;
    }

    const digitCount = Math.abs(phone).toString().length;
    let isValid = digitCount >= 8;

    if (!isValid) {
        phoneError.innerHTML = "ungültige Telefonnummer";
        return false;
    }
    return true;
}

/**
 * Erstellt einen neuen Kontakt.
 * Der Name wird formatiert und die Initialen werden aus dem Vor- und Nachnamen abgeleitet.
 * @param {string} name - Der Name des Kontakts.
 * @param {string} mail - Die E-Mail-Adresse des Kontakts.
 * @param {string} phone - Die Telefonnummer des Kontakts.
 * @returns {Object} - Ein Kontakt-Objekt mit Name, E-Mail, Telefonnummer, Initialen und Buchstaben des Namens.
 */
function createNewContact(name, mail, phone) {
    const capitalizeWords = str => 
        str.split(" ")
           .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
           .join(" ");
    let formattedName = capitalizeWords(name);
    let [vorname, nachname] = formattedName.split(" ");
    return {
        name: formattedName,
        email: mail,
        phone: phone,
        letter: vorname ? vorname[0].toUpperCase() : "",
        initialien: (vorname ? vorname[0].toUpperCase() : "") + (nachname ? nachname[0].toUpperCase() : ""),
    };
}

/**
 * Öffnet das Overlay zum Bearbeiten eines Kontakts.
 */
function openEditContactOverlay(){
    let contentRef = document.getElementById('edit-contact-details-overlay-id');
    contentRef.classList.remove('d-none');
}

/**
 * Schließt das Overlay zum Bearbeiten eines Kontakts und öffnet das Kontakt-Detail-Overlay.
 * @param {number} index - Der Index des Kontakts, dessen Details angezeigt werden sollen.
 */
function closeEditContactOverlay(index){
    let contentRef = document.getElementById('edit-contact-details-overlay-id');
    contentRef.classList.add('d-none');
    openContactDetailsOverlay(index);
}

/**
 * Bearbeitet einen Kontakt, indem die neuen Werte validiert und gespeichert werden.
 * @param {number} index - Der Index des zu bearbeitenden Kontakts.
 */
function editContact(index) {
    let name = document.getElementById('edit-input-name-id').value;
    let mail = document.getElementById('edit-input-mail-id').value;
    let phone = document.getElementById('edit-input-phone-id').value;
    if (validateEditName(name) && validateEditEmail(mail) && validateEditPhone(phone)) {
        loadedContacts[index] = createNewContact(name, mail, phone);
        saveContactsToLocalStorage();
        renderContacts();
        closeEditContactOverlay(index);
    }
}

/**
 * Validiert den Namen eines bearbeiteten Kontakts.
 * Der Name muss nur Buchstaben und Leerzeichen enthalten.
 * @param {string} name - Der Name, der validiert werden soll.
 * @returns {boolean} - Gibt `true` zurück, wenn der Name gültig ist, andernfalls `false`.
 */
function validateEditName(name){
    const nameRegex = /^[a-zA-ZäöüßÄÖÜ\s]+$/;
    const nameError = document.getElementById('name-error-id');
    nameError.innerHTML = "";
    if (!nameRegex.test(name)) {
      nameError.innerHTML = "Bitte einen gültigen Namen eingeben"
      return false;
    } else {
        return true;
    }
}

/**
 * Validiert die E-Mail-Adresse eines bearbeiteten Kontakts.
 * @param {string} mail - Die E-Mail-Adresse, die validiert werden soll.
 * @returns {boolean} - Gibt `true` zurück, wenn die E-Mail gültig ist, andernfalls `false`.
 */
function validateEditEmail(mail){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailError = document.getElementById('mail-error-id');
    mailError.innerHTML = "";
    if(!emailRegex.test(mail)){
        mailError.innerHTML = "ungültiges Email Format";
        return false;
    } return true;
}

/**
 * Validiert die Telefonnummer eines bearbeiteten Kontakts.
 * Die Telefonnummer muss mindestens 8 Ziffern lang sein, wenn sie nicht leer ist.
 * @param {string} phonenumber - Die Telefonnummer, die validiert werden soll.
 * @returns {boolean} - Gibt `true` zurück, wenn die Telefonnummer gültig ist, andernfalls `false`.
 */
function validateEditPhone(phonenumber){
    const phoneError = document.getElementById('phone-error-id');
    phoneError.innerHTML = "";

    if (phonenumber === "") {
        return true;
    } 

    const digitCount = Math.abs(phonenumber).toString().length;
    if(digitCount < 8){
        phoneError.innerHTML = "ungültige Telefonnummer";
        return false;
    } return true;
}

/**
 * Löscht einen Kontakt aus der Liste und aktualisiert die Anzeige.
 * @param {number} index - Der Index des zu löschenden Kontakts.
 */
function deleteContact(index) {
    loadedContacts.splice(index, 1);
    saveContactsToLocalStorage();
    renderContacts();
    closeEditContactOverlay(index);
    closeContactDetailsOverlay();
}

/**
 * Startet eine Animation für das fliegende Div-Element.
 * Das Div-Element wird sichtbar und verschwindet nach einer kurzen Zeit wieder.
 */
function startAnimation() {
    const flyingDiv = document.getElementById('flying-div-id');
    flyingDiv.classList.remove('d-none', 'disappear');
    setTimeout(() => {
        flyingDiv.classList.add('visible');
    }, 10);

    setTimeout(() => {
        flyingDiv.classList.remove('visible');
        flyingDiv.classList.add('disappear');

        setTimeout(() => {
            flyingDiv.classList.add('d-none');
        }, 500); 
    }, 3000);
}

/**
 * Zeigt das Edit/Delete-Div-Element an.
 */
function showEditDeleteDiv(){
    const contentRef = document.getElementById('edit-delete-div-id');
    contentRef.classList.remove('d-none');
}

/**
 * Versteckt das Edit/Delete-Div-Element.
 */
function hideEditDeleteDiv(){
    const contentRef = document.getElementById('edit-delete-div-id');
    contentRef.classList.add('d-none');
}