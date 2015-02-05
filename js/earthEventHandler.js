
function Earth() {
}
;

/**
 * Resets the view of the earth to the prime meridian (Greenwich) and the
 * equator line.
 */
Earth.resetView = function () {
    var earth = document.getElementById("earth");
    earth.runtime.showAll();
};

/**
 * Toggles the texture of the earth whenever the appropriate button has
 * been clicked. As of now two textures can be applied: The regular
 * topographical map of the earth and the topographical map including
 * country boundaries.
 *
 * @param button used for toggling its background color
 */
Earth.toggleCountryBoundaries = function (button) {
    var imgNormal = "img/blue_marble.png";
    var imgBoundaries = "img/blue_marble_boundaries.png";
    var earthTexture = document.getElementById("earthTexture");

    if (button.style.backgroundColor !== "blue") {
        earthTexture.setAttribute("url", imgBoundaries);
        button.style.backgroundColor = "blue";
    } else {
        earthTexture.setAttribute("url", imgNormal);
        button.style.backgroundColor = "transparent";
    }
};


