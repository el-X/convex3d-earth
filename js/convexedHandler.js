/**
 * Initializes the website.
 */
function initConvexedEarth() {
    resetEarthView();
    resetInfoView();
    loadCountries();
}

/**
 * Resets the view of the earth to the prime meridian (Greenwich) and the
 * equator line.
 */
function resetEarthView() {
    var earth = document.getElementById("earth");
    earth.runtime.showAll();
}

/**
 * Resets the wikiFrame on page load/reload.
 * This is needed due to the fact that a country selection followed
 * by a page reload causes the content of the wikiFrame not to
 * disappear.
 */
function resetInfoView() {
    var wikiFrame = document.getElementById("wikiFrame");
    wikiFrame.src = "";
    var wikiLink = document.getElementById("outlink");
    wikiLink.style.display = "none";
}

/**
 * Creates a table containing all available countries. This is done
 * by using an XSL-Transformation.
 *
 * Data: data/countries.xml.
 * Stylesheet: xsl/countryIndex.xsl.
 */
function loadCountries()
{
    countries = proceedXslt("data/countries.xml", "xsl/countryIndex.xsl");
    if (window.ActiveXObject || xhttp.responseType === "msxml-document")
    {
        document.getElementById("countryIndex").innerHTML = countries;
    } else if (document.implementation && document.implementation.createDocument)
    {
        document.getElementById("countryIndex").appendChild(countries);
    }

}

/**
 * Toggles the texture of the earth whenever the appropriate button has
 * been clicked. As of now two textures can be applied: The regular
 * topographical map of the earth and the topographical map including
 * country boundaries.
 *
 * @param button used for toggling its background color
 */
function toggleCountryBoundaries(button) {
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
}

/**
 * Fills the wiki frame (on the right hand side of the website) with a WikiPage
 * for the specific country.
 *
 * @param name of the country
 */
function showWikiPage(name) {
    var sideLink = "http://en.m.wikipedia.org/wiki/";
    var fullLink = "http://en.wikipedia.org/wiki/";

    var wikiLink = document.getElementById("outlink");
    var wikiFrame = document.getElementById("wikiFrame");

    document.getElementById("info").style.display = "none";

    wikiLink.href = fullLink + name;
    wikiLink.style.display = "block";
    wikiFrame.src = sideLink + name;
    window.scrollTo(0, 0);
    resetEarthView();
}
