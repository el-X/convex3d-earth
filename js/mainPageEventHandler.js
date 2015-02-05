
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
    countriesTable = proceedXslt("data/countries.xml", "xsl/countriesTable.xsl");

    if (window.ActiveXObject || xhttp.responseType === "msxml-document")
    {
        document.getElementById("countriesTable").innerHTML = countriesTable;
    } else if (document.implementation && document.implementation.createDocument)
    {
        document.getElementById("countriesTable").appendChild(countriesTable);
    }

};