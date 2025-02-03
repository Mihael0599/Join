/**
 * Lädt ein rechtliches Dokument für das Benutzer-Menü und setzt den Inhalt in den "main-content"-Bereich.
 * 
 * @param {string} htmlPage - Der Name der HTML-Seite (ohne Erweiterung), die geladen werden soll.
 * @returns {Promise<void>} Ein Promise, das bei Abschluss des Ladevorgangs aufgelöst wird.
 */
async function loadLegalDocumentUsrMenu(htmlPage) {
    const response = await fetch('../HTML/' + htmlPage + '.html');
    const htmlContent = await response.text();

    document.getElementById("main-content").innerHTML = /*html*/`
        ${htmlContent}
    `;
    toggleUsrMenu();
}

/**
 * Lädt ein rechtliches Dokument und setzt den Inhalt in den "main-content"-Bereich.
 * 
 * @param {string} htmlPage - Der Name der HTML-Seite (ohne Erweiterung), die geladen werden soll.
 * @returns {Promise<void>} Ein Promise, das bei Abschluss des Ladevorgangs aufgelöst wird.
 */
async function loadLegalDocument(htmlPage) {
    const response = await fetch('../HTML/' + htmlPage + '.html');
    const htmlContent = await response.text();

    document.getElementById("main-content").innerHTML = /*html*/`
        ${htmlContent}
    `;
}

/**
 * Überprüft, ob der Benutzer eingeloggt ist, und passt das Design der Navigation und des Menüs an.
 * Ändert die CSS-Klassen von verschiedenen Elementen, um den Status eines eingeloggten Benutzers darzustellen.
 */
function inOrOut() {
    let status = JSON.parse(localStorage.getItem("loggedInUser"));
    
    navBar = document.getElementById("frame-nav-bar");
    menu = document.getElementById("menu");
    logIn = document.getElementById("log-in");
    legalDocuments = document.getElementById("legal-documents");
    headerRight = document.getElementById("header-right");
  
    if (status) {
      navBar.className = "frame-nav-bar-logged-in";
      menu.className = "menu-logged-in";
      logIn.className = "log-in-logged-in";
      legalDocuments.className = "legal-documents-logged-in";
      headerRight.className = "header-right-logged-in";
    }
  }