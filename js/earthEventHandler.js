
function Earth() {
}
;
// Static variables
Earth.imgNormalLow = "img/blue_marble_low.jpg";
Earth.imgBoundariesLow = "img/blue_marble_boundaries_low.jpg";
Earth.imgNormalHigh = "img/blue_marble_high.jpg";
Earth.imgBoundariesHigh = "img/blue_marble_boundaries_high.jpg";

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

    var earthTexture = document.getElementById("earthTexture");
    var textureUrl = earthTexture.getAttribute("url");

    if (textureUrl === Earth.imgNormalLow) {
        earthTexture.setAttribute("url", Earth.imgBoundariesLow);
        button.style.backgroundColor = "blue";
    } else if (textureUrl === Earth.imgBoundariesLow) {
        earthTexture.setAttribute("url", Earth.imgNormalLow);
        button.style.backgroundColor = "transparent";
    } else if (textureUrl === Earth.imgNormalHigh) {
        earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
        button.style.backgroundColor = "blue";
    } else if (textureUrl === Earth.imgBoundariesHigh) {
        earthTexture.setAttribute("url", Earth.imgNormalHigh);
        button.style.backgroundColor = "transparent";
    }
};

/**
 * Toggles the texture resolution of the earth whenever the appropriate button has
 * been clicked.
 *
 * @param button used for toggling the texture resolution
 */
Earth.toggleResolution = function (button) {
    var earthTexture = document.getElementById("earthTexture");
    var textureUrl = earthTexture.getAttribute("url");

    if (textureUrl === Earth.imgNormalLow) {
        earthTexture.setAttribute("url", Earth.imgNormalHigh);
        button.style.backgroundColor = "blue";
    } else if (textureUrl === Earth.imgNormalHigh) {
        earthTexture.setAttribute("url", Earth.imgNormalLow);
        button.style.backgroundColor = "transparent";
    } else if (textureUrl === Earth.imgBoundariesHigh) {
        earthTexture.setAttribute("url", Earth.imgBoundariesLow);
        button.style.backgroundColor = "transparent";
    } else if (textureUrl === Earth.imgBoundariesLow) {
        earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
        button.style.backgroundColor = "blue";
    }
};

