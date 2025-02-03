let btnUrgent = document.getElementById("btn-urgent");
let imgUrgent = document.getElementById("urgent-img");
let btnMedium = document.getElementById("btn-medium");
let imgMedium = document.getElementById("medium-img");
let btnLow = document.getElementById("btn-low");
let imgLow = document.getElementById("low-img");
let imgSources = {
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
 * Ändert die Farbe und die Bildquelle der Prioritäts-Schaltflächen basierend auf der ausgewählten Priorität.
 * @param {string} priority Die ausgewählte Priorität, die entweder "urgent", "medium" oder "low" sein kann.
 */
function changeColorPrioBtn(priority) {
    let bgColors = { urgent: "#FF3B30", medium: "#FFA800", low: "#4CD964" };

    resetButtonStyles();
    selectedPriority = priority;
    setButtonStyles(priority, bgColors[priority]);
    setImageSources(imgSources[priority]);
}

/**
 * Setzt die Hintergrundfarben der Prioritäts-Schaltflächen auf den Standardwert zurück.
 */
function resetButtonStyles() {
    btnUrgent.style.backgroundColor =
        btnMedium.style.backgroundColor =
        btnLow.style.backgroundColor =
        "#ffffff";
}

/**
 * Setzt die Hintergrundfarbe der ausgewählten Prioritäts-Schaltfläche.
 * @param {string} priority Die Priorität, die geändert werden soll ("urgent", "medium", oder "low").
 * @param {string} bgColor Die Hintergrundfarbe, die gesetzt werden soll.
 */
function setButtonStyles(priority, bgColor) {
    if (priority === "urgent") btnUrgent.style.backgroundColor = bgColor;
    else if (priority === "medium") btnMedium.style.backgroundColor = bgColor;
    else if (priority === "low") btnLow.style.backgroundColor = bgColor;
}

/**
 * Setzt die Bildquellen der Prioritätsbilder für alle drei Prioritätsstufen.
 * @param {Array<string>} [urgentImgSrc, mediumImgSrc, lowImgSrc] Ein Array mit den Bildquellen für jede Prioritätsstufe.
 */
function setImageSources([urgentImgSrc, mediumImgSrc, lowImgSrc]) {
    imgUrgent.src = urgentImgSrc;
    imgMedium.src = mediumImgSrc;
    imgLow.src = lowImgSrc;
}