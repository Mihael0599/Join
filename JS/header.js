/**
 * Schaltet das Benutzer-Menü und das Overlay ein oder aus.
 * Diese Funktion wird verwendet, um das Benutzer-Menü und das Overlay-Element bei Bedarf ein- oder auszublenden.
 */
function toggleUsrMenu() {
  document.getElementById("usr-menu").classList.toggle('usr-menu-closed');
  document.getElementById("ar-overlay").classList.toggle('ar-overlay-closed');
}

/**
 * Loggt den Benutzer aus, indem alle Daten aus dem lokalen Speicher entfernt werden.
 * Diese Funktion entfernt alle gespeicherten Benutzerdaten, die im lokalen Speicher abgelegt sind, 
 * um den Benutzer abzumelden.
 */
function logOut() {
  localStorage.clear();
}
