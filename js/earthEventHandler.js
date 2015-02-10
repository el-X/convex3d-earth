
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
            this.setButtonActive(button);
            break;
        case Earth.imgBoundariesLow:
            earthTexture.setAttribute("url", Earth.imgNormalLow);
            this.setButtonDeactive(button);
            break;
        case Earth.imgNormalHigh:
            earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
            this.setButtonActive(button);
            break;
        case Earth.imgBoundariesHigh:
            earthTexture.setAttribute("url", Earth.imgNormalHigh);
            this.setButtonDeactive(button);
            break;
        default:
            earthTexture.setAttribute("url", Earth.imgNormalLow);
            this.setButtonDeactive(button);
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
            this.setButtonActive(button);
            break;
        case Earth.imgNormalHigh:
            earthTexture.setAttribute("url", Earth.imgNormalLow);
            this.setButtonDeactive(button);
            break;
        case Earth.imgBoundariesHigh:
            earthTexture.setAttribute("url", Earth.imgBoundariesLow);
            this.setButtonDeactive(button);
            break;
        case Earth.imgBoundariesLow:
            earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
            this.setButtonActive(button);
            break;
        default:
            earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
            this.setButtonActive(button);
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
        this.setButtonActive(button);
    } else {
        capitalPinsGroup.setAttribute("render", false);
        this.setButtonDeactive(button);
    }
};

/**
 * Sets the given button active by changing the background color to blue.
 *
 * @param button which should be changed
 */
Earth.setButtonActive = function (button) {
    button.style.backgroundColor = "blue";
};

/**
 * Sets the given button deactive by changing the background color to transparent.
 *
 * @param button which should be changed
 */
Earth.setButtonDeactive = function (button) {
    button.style.backgroundColor = "transparent";
};