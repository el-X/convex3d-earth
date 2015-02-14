
function MainPage() {
}
;

/**
 * Initializes the website by filling it with content.
 */
MainPage.initConvexedEarth = function () {
    Earth.resetView();
    Wiki.resetInfoView();
    MainPage.loadCountries();
    MainPage.loadCapitals();
};

/**
 * Creates a table containing all available countries. This is done
 * by using an XSL-Transformation. The code is derived from
 * http://www.w3schools.com/xsl/xsl_client.asp
 *
 * Data: data/countries.xml.
 * Stylesheet: xsl/countryTable.xsl.
 */
MainPage.loadCountries = function () {
    // The Internet Explorer has encoding problems when it comes to outputting
    // html for the country and capital names, which is why the transformation
    // process is done with the output method "xml" in this case
    var ieXmlOutput = true;

    countryTable = XSLTransformer.processTransformation("data/countries.xml", "xsl/countryTable.xsl", ieXmlOutput);

    if (window.ActiveXObject || xhttp.responseType === "msxml-document") {
        document.getElementById("countryTable").innerHTML = countryTable;
    } else if (document.implementation && document.implementation.createDocument) {
        document.getElementById("countryTable").appendChild(countryTable);
    }
};

/**
 * Creates X3D objects for capitals which are shown as pins on the map.
 * The code is derived from http://www.w3schools.com/xsl/xsl_client.asp
 *
 * Data: data/countries.xml.
 * Stylesheet: xsl/capitalPins.xsl.
 */
MainPage.loadCapitals = function () {
    // The output method for X3D elements is "html"; that also accounts to the Internet Explorer
    var ieXmlOutput = false;
    capitals = XSLTransformer.processTransformation("data/countries.xml", "xsl/capitalPins.xsl", ieXmlOutput);

    if (window.ActiveXObject || xhttp.responseType === "msxml-document") {
        document.getElementById("capitalPins").innerHTML = capitals;
    } else if (document.implementation && document.implementation.createDocument) {
        document.getElementById("capitalPins").appendChild(capitals);
    }
};