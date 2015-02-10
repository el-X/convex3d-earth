
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

    switch (textureUrl) {
        case Earth.imgNormalLow:
            earthTexture.setAttribute("url", Earth.imgBoundariesLow);
            button.style.backgroundColor = "blue";
            break;
        case Earth.imgBoundariesLow:
            earthTexture.setAttribute("url", Earth.imgNormalLow);
            button.style.backgroundColor = "transparent";
            break;
        case Earth.imgNormalHigh:
            earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
            button.style.backgroundColor = "blue";
            break;
        case Earth.imgBoundariesHigh:
            earthTexture.setAttribute("url", Earth.imgNormalHigh);
            button.style.backgroundColor = "transparent";
            break;
        default:
            earthTexture.setAttribute("url", Earth.imgNormalLow);
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

    switch (textureUrl) {
        case Earth.imgNormalLow:
            earthTexture.setAttribute("url", Earth.imgNormalHigh);
            button.style.backgroundColor = "blue";
            break;
        case Earth.imgNormalHigh:
            earthTexture.setAttribute("url", Earth.imgNormalLow);
            button.style.backgroundColor = "transparent";
            break;
        case Earth.imgBoundariesHigh:
            earthTexture.setAttribute("url", Earth.imgBoundariesLow);
            button.style.backgroundColor = "transparent";
            break;
        case Earth.imgBoundariesLow:
            earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
            button.style.backgroundColor = "blue";
            break;
        default:
            earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
            button.style.backgroundColor = "blue";
    }
};

/**
 * Toggles the visibility of capital pins.
 *
 * @param button used for toggling the capital pins visibility
 */
Earth.toggleCapitalPins = function (button) {
    var capitalPinsGroup = document.getElementById("capitalPins");
    var renderAttrValue = capitalPinsGroup.getAttribute("render");
    if (renderAttrValue === "false") {
        capitalPinsGroup.setAttribute("render", true);
        button.style.backgroundColor = "blue";
    } else {
        capitalPinsGroup.setAttribute("render", false);
        button.style.backgroundColor = "transparent";
    }
};

