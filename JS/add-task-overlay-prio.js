let btnUrgent = document.getElementById("btn-urgent-overlay");
let imgUrgent = document.getElementById("urgent-img-overlay");
let btnMedium = document.getElementById("btn-medium-overlay");
let imgMedium = document.getElementById("medium-img-overlay");
let btnLow = document.getElementById("btn-low-overlay");
let imgLow = document.getElementById("low-img-overlay");
let imgSourcesOverlay = {
    urgent: [
      "../Assets/prio_arrow_white.png",
      "../Assets/prio_line_orange.png",
      "../Assets/prio_low.png",
    ],
    medium: [
      "../Assets/prio_urgent.png",
      "../Assets/prio_medium.png",
      "../Assets/prio_low.png",
    ],
    low: [
      "../Assets/prio_urgent.png",
      "../Assets/prio_line_orange.png",
      "../Assets/prio_arrowDown_white.png",
    ],
  };

/**
 * Ändert die Farben und Bildquellen der Prioritäts-Schaltflächen und -Bilder basierend auf der gewählten Priorität.
 * @param {string} priority - Die gewählte Priorität, kann "urgent", "medium" oder "low" sein.
 */
function changeColorPrioBtnOverlay(priority) {
    let bgColorsOverlay = { urgent: "#FF3B30", medium: "#FFA800", low: "#4CD964" };
  
    resetButtonStylesOverlay();
    selectedPriorityOverlay = priority;
    setButtonStylesOverlay(priority, bgColorsOverlay[priority]);
    setImageSourcesOverlay(imgSourcesOverlay[priority]);
  }
  
  /**
 * Setzt die Hintergrundfarben aller Prioritäts-Schaltflächen auf die Standardfarbe zurück.
 */
  function resetButtonStylesOverlay() {
    btnUrgent.style.backgroundColor =
      btnMedium.style.backgroundColor =
      btnLow.style.backgroundColor =
        "#ffffff";
  }
  
  /**
 * Setzt den Hintergrundfarbwert der Schaltfläche für die angegebene Priorität.
 * @param {string} priority - Die Priorität, für die die Schaltfläche aktualisiert wird. Kann "urgent", "medium" oder "low" sein.
 * @param {string} bgColorOverlay - Die Hintergrundfarbe, die der Schaltfläche zugewiesen wird.
 */
  function setButtonStylesOverlay(priority, bgColorOverlay) {
    if (priority === "urgent") btnUrgent.style.backgroundColor = bgColorOverlay;
    else if (priority === "medium") btnMedium.style.backgroundColor = bgColorOverlay;
    else if (priority === "low") btnLow.style.backgroundColor = bgColorOverlay;
  }
  
  /**
 * Setzt die Bildquellen für die Prioritäts-Bilder.
 * @param {Array} imgSources - Ein Array von Bildquellen für "urgent", "medium" und "low" Priorität in dieser Reihenfolge.
 * @param {string} imgSources[0] - Die Bildquelle für das "urgent"-Bild.
 * @param {string} imgSources[1] - Die Bildquelle für das "medium"-Bild.
 * @param {string} imgSources[2] - Die Bildquelle für das "low"-Bild.
 */
  function setImageSourcesOverlay([urgentImgSrc, mediumImgSrc, lowImgSrc]) {
    imgUrgent.src = urgentImgSrc;
    imgMedium.src = mediumImgSrc;
    imgLow.src = lowImgSrc;
  }