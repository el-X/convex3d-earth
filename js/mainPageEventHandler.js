
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
 * Stylesheet: xsl/countriesTable.xsl.
 */
MainPage.loadCountries = function ()
{
    countriesTable = XSLTransformer.proceedXslt("data/countries.xml", "xsl/countriesTable.xsl");

    if (window.ActiveXObject || xhttp.responseType === "msxml-document")
    {
        document.getElementById("countriesTable").innerHTML = countriesTable;
    } else if (document.implementation && document.implementation.createDocument)
    {
        document.getElementById("countriesTable").appendChild(countriesTable);
    }

};

/**
 * Creates X3D objects for capitals which are shown as pins on the map.
 *
 * Data: data/countries.xml.
 * Stylesheet: xsl/capitalsPins.xsl.
 */
MainPage.loadCapitals = function () {
    capitals = XSLTransformer.proceedXslt("data/countries.xml", "xsl/capitalsPins.xsl");

    if (window.ActiveXObject || xhttp.responseType === "msxml-document")
    {
        document.getElementById("capitalsPins").innerHTML = capitals;
    } else if (document.implementation && document.implementation.createDocument)
    {
        document.getElementById("capitalsPins").appendChild(capitals);
    }
};