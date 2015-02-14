
function XSLTransformer() {
}
;

/**
 * Loads an xml file with a given filename and retuns it.
 * Code adapted from http://www.w3schools.com/xsl/xsl_client.asp
 *
 * @param {string} filename the name of the xml document to be loaded
 * @returns {XMLDocument} xml the xml document
 */
XSLTransformer.loadXMLDoc = function (filename) {
    // Internet Explorer handling
    if (window.ActiveXObject) {
        // IE5 and 6
        xhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } else {
        xhttp = new XMLHttpRequest();
    }
    xhttp.open("GET", filename, false);
    try {
        xhttp.responseType = "msxml-document";
    } catch (err) {
    } // Helping IE11

    xhttp.send("");
    return xhttp.responseXML;
};

/**
 * Processes an XSL-Transformation with the given XML and XSL file.
 * Set ieXmlOutput to true, if the output method of the stylesheet should be
 * changed to "xml". The ieXmlOutput parameter is only used for the Internet
 * Explorer. The Code is adapted from http://www.w3schools.com/xsl/xsl_client.asp
 *
 * @param {string} xmlFilename an xml dataset
 * @param {string} xslFilename the stylesheet for the transformation
 * @param {boolean} ieXmlOutput true if the stylesheet output should be xml (IE only !)
 * @returns {XMLDocument} transformation result
 */
XSLTransformer.processTransformation = function (xmlFilename, xslFilename, ieXmlOutput) {
    result = "";
    xml = XSLTransformer.loadXMLDoc(xmlFilename);
    xsl = XSLTransformer.loadXMLDoc(xslFilename);
    // Internet Explorer handling
    if (window.ActiveXObject || xhttp.responseType === "msxml-document") {
        if (ieXmlOutput === true) {
            var outputElements = xsl.getElementsByTagName("xsl:output");
            outputElements[0].setAttribute("method", "xml");
        }
        result = xml.transformNode(xsl);
    }
    // Chrome, Firefox, Opera, etc. (modern browsers) handling
    else if (document.implementation && document.implementation.createDocument) {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        result = xsltProcessor.transformToFragment(xml, document);
    }
    return result;
};