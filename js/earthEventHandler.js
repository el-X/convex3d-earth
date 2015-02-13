
function Earth() {
}
;

// Static variables for the earth textures.
Earth.imgNormalLow = "img/blue_marble_low.jpg";
Earth.imgBoundariesLow = "img/blue_marble_boundaries_low.jpg";
Earth.imgNormalHigh = "img/blue_marble_high.jpg";
Earth.imgBoundariesHigh = "img/blue_marble_boundaries_high.jpg";

/**
 * Used for determining the camera position and rotation in relation to the
 * given country boundary box. This is needed for the displayment of a certain
 * country.
 *
 * @param {Number} northLatitude the northernmost latitude (in °) of the country
 * @param {Number} southLatitude the southernmost latitude (in °) of the country
 * @param {Number} westLongitude the westernmost latitude (in °) of the country
 * @param {Number} eastLongitude the easternmost latitude (in °) of the country
 */
Earth.showCountry = function (northLatitude, southLatitude, westLongitude, eastLongitude) {
    var view = Earth.getNextView();

    var cameraPosition = Earth.calculateCameraPosition(northLatitude, southLatitude, westLongitude, eastLongitude);
    var cameraOrientation = Earth.calculateCameraOrientation(cameraPosition);

    view.setAttribute("orientation", cameraOrientation.toString());
    view.setAttribute("position", cameraPosition.toString());
    view.setAttribute("set_bind", "true");
};

/**
 * In order to enable a smooth camera animation for the displayment of a certain
 * country, two Viewpoints need to be defined. Switching from one Viewpoint
 * to another and vice versa, is done here.
 *
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
};

/**
 * Calculates the position for the camera with regard to the given country
 * boundaries.
 *
 * @param {Number} northLatitude the northernmost latitude (in °) of the country
 * @param {Number} southLatitude the southernmost latitude (in °) of the country
 * @param {Number} westLongitude the westernmost latitude (in °) of the country
 * @param {Number} eastLongitude the easternmost latitude (in °) of the country
 * @return {Array} the camera position (x, y, z)
 */
Earth.calculateCameraPosition = function (northLatitude, southLatitude, westLongitude, eastLongitude) {
    var latCenter = Earth.calculateLatitudeCenter(northLatitude, southLatitude);
    var lonCenter = Earth.calculateLongitudeCenter(westLongitude, eastLongitude);
    var scaleFactor = Earth.calculateScaleFactor(northLatitude, southLatitude, westLongitude, eastLongitude);

    // Spherical coordinates -> Cartesian coordinates
    var x = Math.cos(latCenter) * Math.sin(lonCenter) * scaleFactor;
    var y = Math.sin(latCenter) * scaleFactor;
    var z = Math.cos(latCenter) * Math.cos(lonCenter) * scaleFactor;

    return new Array(x, y, z);
};

/**
 * Simple calculation for the central latitude.
 * @param {Number} northLatitude the northernmost latitude (in °) of the country
 * @param {Number} southLatitude the southernmost latitude (in °) of the country
 * @returns {Number} the center latitude (in radians)
 */
Earth.calculateLatitudeCenter = function (northLatitude, southLatitude) {
    var lat = (northLatitude + southLatitude) / 2;
    var latCenter = lat * Math.PI / 180;

    return latCenter;
};

/**
 * Determine the center of the longitude. For a detailed explanation at why and
 * how the following calculation works, please refer to:
 * http://blog.cartodb.com/center-of-points/
 * @param {type} westLongitude the westernmost latitude (in °) of the country
 * @param {type} eastLongitude the easternmost latitude (in °) of the country
 * @returns {Number} the center longitude (in radians)
 */
Earth.calculateLongitudeCenter = function (westLongitude, eastLongitude) {
    // mapp the longitudes to a two-dimensional ring of radius one (unit circle)
    var lonWestSin = Math.sin(westLongitude * Math.PI / 180);
    var lonEastSin = Math.sin(eastLongitude * Math.PI / 180);
    var lonWestCos = Math.cos(westLongitude * Math.PI / 180);
    var lonEastCos = Math.cos(eastLongitude * Math.PI / 180);

    var centerSin = (lonWestSin + lonEastSin) / 2;
    var centerCos = (lonWestCos + lonEastCos) / 2;

    // determine the angle by preserving the signs of the inputs (atan2)
    var lonCenter = Math.atan2(centerSin, centerCos);

    return lonCenter;
};

/**
 * Calculates the scale factor for the camera position in respect to the
 * given country borders.
 *
 * @param {Number} northLatitude the northernmost latitude (in °) of the country
 * @param {Number} southLatitude the southernmost latitude (in °) of the country
 * @param {Number} westLongitude the westernmost latitude (in °) of the country
 * @param {Number} eastLongitude the easternmost latitude (in °) of the country
 * @return {Number} the scale factor for the camera position
 */
Earth.calculateScaleFactor = function (northLatitude, southLatitude, westLongitude, eastLongitude) {
    var scaleBase = 0.0;
    var scaleFactor = 0.0;

    var minScaleFactor = 1.2;
    var maxScaleFactor = 2.1;

    var latitudeDist = Math.abs(northLatitude - southLatitude);
    var longitudeDist = Math.abs(westLongitude - eastLongitude);

    // the scale base is determined by the biggest distance
    scaleBase = latitudeDist < longitudeDist ? longitudeDist : latitudeDist;

    // do a mapping (0° ≙ minScaleFactor, 180° ≙ maxScaleFactor)
    scaleFactor = minScaleFactor + ((maxScaleFactor - minScaleFactor) * (scaleBase / 180));

    // make sure that the scaleFactor is in the bounds of the minimum and maximum scale factor
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
 * which to look at (the origin [0, 0, 0]) and the upright position
 * (the Y-Axis [0, 1, 0]).
 * The code was derived from http://doc.x3dom.org/tutorials/lighting/mirror/index.html
 * and further simplified.
 *
 * @param {Array} cameraPosition the position of the camera in (x y z)
 * @return {Array} camera orientation (x y z angle)
 */
Earth.calculateCameraOrientation = function (cameraPosition) {
    var cameraPosition = new x3dom.fields.SFVec3f(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    var earthCenterPosition = new x3dom.fields.SFVec3f(0, 0, 0);
    var uprightPosition = new x3dom.fields.SFVec3f(0, 1, 0);

    // the transformation matrix for the camera orientation
    var lookAtMatrix = x3dom.fields.SFMatrix4f.lookAt(cameraPosition, earthCenterPosition, uprightPosition);
    var rotation = new x3dom.fields.Quaternion(0, 0, 0, 0);
    rotation.setValue(lookAtMatrix);

    // transform Quaternion to Axis angles (axis [x,y,z] and the angle to rotate around that axis)
    var orientation = rotation.toAxisAngle();

    return orientation;
};

/**
 * Resets the view of the earth to the prime meridian (Greenwich) and the
 * equator line. Also resets the center of rotation, since X3DOM sometimes
 * randomly changes it.
 */
Earth.resetView = function () {
    var earth = document.getElementById("earth");
    earth.runtime.viewpoint()._xmlNode.setAttribute("centerOfRotation", "0 0 0");
    earth.runtime.showAll();
};

/**
 * Toggles the texture of the earth whenever the appropriate button has
 * been clicked. Four textures can be applied in total: The regular
 * topographical map of the earth and the topographical map including
 * country boundaries, who then again both have a low resolution and
 * and a high resolution version.
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
            this.setButtonInactive(button);
            break;
        case Earth.imgNormalHigh:
            earthTexture.setAttribute("url", Earth.imgBoundariesHigh);
            this.setButtonActive(button);
            break;
        case Earth.imgBoundariesHigh:
            earthTexture.setAttribute("url", Earth.imgNormalHigh);
            this.setButtonInactive(button);
            break;
        default:
            earthTexture.setAttribute("url", Earth.imgNormalLow);
            this.setButtonInactive(button);
    }
};

/**
 * Toggles the texture resolution of the earth whenever the appropriate button
 * has been clicked. Since country boundaries can be displayed, a
 * differentiation of four textures has to be made.
 *
 * @param button used for toggling its background color
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
            this.setButtonInactive(button);
            break;
        case Earth.imgBoundariesHigh:
            earthTexture.setAttribute("url", Earth.imgBoundariesLow);
            this.setButtonInactive(button);
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
 * Toggles the visibility of the capital pins.
 *
 * @param button used for toggling its background color
 */
Earth.toggleCapitalPins = function (button) {
    var capitalPins = document.getElementById("capitalPins");
    var renderCapitalPins = capitalPins.getAttribute("render");
    if (renderCapitalPins === "false") {
        capitalPins.setAttribute("render", true);
        this.setButtonActive(button);
    } else {
        capitalPins.setAttribute("render", false);
        this.setButtonInactive(button);
    }
};

/**
 * Sets the given button active by changing the background color to blue.
 *
 * @param button whose color should be changed
 */
Earth.setButtonActive = function (button) {
    button.style.backgroundColor = "blue";
};

/**
 * Sets the given button deactive by changing the background color to transparent.
 *
 * @param button whose color should be changed
 */
Earth.setButtonInactive = function (button) {
    button.style.backgroundColor = "transparent";
};
