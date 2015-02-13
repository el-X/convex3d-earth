
function Earth() {
}
;
// Static variables
Earth.imgNormalLow = "img/blue_marble_low.jpg";
Earth.imgBoundariesLow = "img/blue_marble_boundaries_low.jpg";
Earth.imgNormalHigh = "img/blue_marble_high.jpg";
Earth.imgBoundariesHigh = "img/blue_marble_boundaries_high.jpg";

/**
 * Displays a country.
 * @param {Number} northLatitude
 * @param {Number} southLatitude
 * @param {Number} westLongitude
 * @param {Number} eastLongitude
 */
Earth.showCountry = function (northLatitude, southLatitude, westLongitude, eastLongitude) {
    var view = Earth.getNextView();

    var cameraPosition = Earth.calculateCameraPosition(northLatitude, southLatitude, westLongitude, eastLongitude);
    var cameraOrientation = Earth.calculateCameraOrientation(cameraPosition);

    view.setAttribute("position", cameraPosition.toString());
    view.setAttribute("orientation", cameraOrientation.toString());
    view.setAttribute("set_bind", "true");
};

/**
 * In order to enable the camera animation for the displayment of a certain
 * country, two Viewpoints need to be defined. Switching from one Viewpoint
 * to another and vice versa, is done here.
 * @returns the next Viewpoint object
 */
Earth.getNextView = function () {
    var earth = document.getElementById("earth");
    var currentView = earth.runtime.viewpoint()._xmlNode;
    var nextView;

    if (currentView.id === "view1") {
        nextView = document.getElementById("view2");
    } else {
        nextView = document.getElementById("view1");
    }

    return nextView;
}

/**
 * Calculates the position for the camera (viewpoint) with given borders.
 * For a detailed explanation at why and how the following calculation of the
 * central longitude works, please refer to: http://blog.cartodb.com/center-of-points/
 *
 * @param {Number} northLatitude
 * @param {Number} southLatitude
 * @param {Number} westLongitude
 * @param {Number} eastLongitude
 * @return {Array} camera position x y z
 */
Earth.calculateCameraPosition = function (northLatitude, southLatitude, westLongitude, eastLongitude) {
    var scaleFactor = Earth.calculateScaleFactor(northLatitude, southLatitude, westLongitude, eastLongitude);

    // Center of the longitude values
    var lonWestSin = Math.sin(westLongitude * Math.PI / 180);
    var lonEastSin = Math.sin(eastLongitude * Math.PI / 180);
    var lonWestCos = Math.cos(westLongitude * Math.PI / 180);
    var lonEastCos = Math.cos(eastLongitude * Math.PI / 180);

    var weightSin = (lonWestSin + lonEastSin) / 2;
    var weightCos = (lonWestCos + lonEastCos) / 2;

    var lonCenter = Math.atan2(weightSin, weightCos);

    // Center of the latitude values
    var lat = (northLatitude + southLatitude) / 2;
    var latCenter = lat * Math.PI / 180;

    // Calculate the position with a scaling factor
    var x = Math.cos(latCenter) * Math.sin(lonCenter) * scaleFactor;
    var y = Math.sin(latCenter) * scaleFactor;
    var z = Math.cos(latCenter) * Math.cos(lonCenter) * scaleFactor;

    return new Array(x, y, z);
};

/**
 * Calculates scale factor for the camera position (viewpoint) with given borders.
 *
 * @param {Number} northLatitude
 * @param {Number} southLatitude
 * @param {Number} westLongitude
 * @param {Number} eastLongitude
 * @return {Number} scale factor
 */
Earth.calculateScaleFactor = function (northLatitude, southLatitude, westLongitude, eastLongitude) {
    var scaleFactor = 0.0;

    var minScaleFactor = 1.2;
    var maxScaleFactor = 2.1;

    var scaleBase = 0.0;
    var latitudeDist = Math.abs(northLatitude - southLatitude);
    var longitudeDist = Math.abs(westLongitude - eastLongitude);

    if (latitudeDist < longitudeDist) {
        scaleBase = longitudeDist;
    } else {
        scaleBase = latitudeDist;
    }

    scaleFactor = minScaleFactor + ((maxScaleFactor - minScaleFactor) * (scaleBase / 180));

    if (scaleFactor < minScaleFactor) {
        scaleFactor = minScaleFactor;
    }
    if (scaleFactor > maxScaleFactor) {
        scaleFactor = maxScaleFactor;
    }
    return scaleFactor;
};

/**
 * Calculates the camera orientation by providing its position, the point at
 * which to look at (the origin) and the upright position (the Y-Axis).
 *
 * @param {Array} cameraPosition (x y z)
 * @return {Array} camera orientation (x y z angle)
 */
Earth.calculateCameraOrientation = function (cameraPosition) {
    var cameraPosition = new x3dom.fields.SFVec3f(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    var earthCenterPosition = new x3dom.fields.SFVec3f(0, 0, 0);
    var uprightPosition = new x3dom.fields.SFVec3f(0, 1, 0);

    var lookAtMatrix = x3dom.fields.SFMatrix4f.lookAt(cameraPosition, earthCenterPosition, uprightPosition);
    var rotation = new x3dom.fields.Quaternion(0, 0, 0, 0);
    rotation.setValue(lookAtMatrix);
    var orientation = rotation.toAxisAngle();

    return orientation;
};

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
