/* Code inspired by http://www.w3schools.com/xsl/xsl_client.asp */

function XSLTransformer() {
}
;

/**
 * Loads an xml file with given a filename and retuns it.
 *
 * @param {string} filename
 * @returns {XMLDocument} xml file
 */
XSLTransformer.loadXMLDoc = function (filename)
{
    // Internet Explorer handling
    if (window.ActiveXObject)
    {
        // IE5 and 6
        xhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else
    {
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
 * Proceeds an XSL-Transformation with the given XML and XSL files.
 * Set ieXmlOutput to true, if the output method of the stylesheet should be changed to xml.
 * The ieXmlOutput parameter is used only for internet explorer.
 *
 * @param {string} xmlFilename with data
 * @param {string} xslFilename stylesheet for transformation
 * @param {boolean} ieXmlOutput if the stylesheet should have xml output (only IE!)
 * @returns {XMLDocument} transformation result
 */
XSLTransformer.proceedXslt = function (xmlFilename, xslFilename, ieXmlOutput)
{
    result = "";
    xml = XSLTransformer.loadXMLDoc(xmlFilename);
    xsl = XSLTransformer.loadXMLDoc(xslFilename);
    // Internet Explorer handling
    if (window.ActiveXObject || xhttp.responseType === "msxml-document")
    {
        if (ieXmlOutput === true) {
            var outputElements = xsl.getElementsByTagName("xsl:output");
            outputElements[0].setAttribute("method", "xml");
        }
        result = xml.transformNode(xsl);
    }
    // Chrome, Firefox, Opera, etc. (modern browsers) handling
    else if (document.implementation && document.implementation.createDocument)
    {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        result = xsltProcessor.transformToFragment(xml, document);
    }
    return result;
};

