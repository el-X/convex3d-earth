
function MainPage() {
}
;

/**
 * Initializes the website.
 */
MainPage.initConvexedEarth = function () {
    Earth.resetView();
    Wiki.resetInfoView();
    MainPage.loadCountries();
    MainPage.loadCapitals();
};

/**
 * Creates a table containing all available countries. This is done
 * by using an XSL-Transformation.
 *
 * Data: data/countries.xml.
 * Stylesheet: xsl/countryTable.xsl.
 */
MainPage.loadCountries = function ()
{
    countryTable = XSLTransformer.proceedXslt("data/countries.xml", "xsl/countryTable.xsl");

    if (window.ActiveXObject || xhttp.responseType === "msxml-document")
    {
        document.getElementById("countryTable").innerHTML = countryTable;
    } else if (document.implementation && document.implementation.createDocument)
    {
        document.getElementById("countryTable").appendChild(countryTable);
    }

};

/**
 * Creates X3D objects for capitals which are shown as pins on the map.
 *
 * Data: data/countries.xml.
 * Stylesheet: xsl/capitalPins.xsl.
 */
MainPage.loadCapitals = function () {
    capitals = XSLTransformer.proceedXslt("data/countries.xml", "xsl/capitalPins.xsl");

    if (window.ActiveXObject || xhttp.responseType === "msxml-document")
    {
        document.getElementById("capitalPins").innerHTML = capitals;
    } else if (document.implementation && document.implementation.createDocument)
    {
        document.getElementById("capitalPins").appendChild(capitals);
    }
};
