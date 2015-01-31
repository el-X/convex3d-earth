/* Code inspired by http://www.w3schools.com/xsl/xsl_client.asp */

/**
 * Loads an xml file with given a filename and retuns it.
 *
 * @param {string} filename
 * @returns {XMLDocument} xml file
 */
function loadXMLDoc(filename)
{
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
        alert("Error occured!");
    } // Helping IE11
    xhttp.send("");
    return xhttp.responseXML;
}

/**
 * Proceeds an XSL-Transformation with the given XML and XSL files.
 *
 * @param {string} xmlFilename with data
 * @param {string} xslFilename stylesheet for transformation
 * @returns {XMLDocument} transformation result
 */
function proceedXslt(xmlFilename, xslFilename)
{
    result = "";
    xml = loadXMLDoc(xmlFilename);
    xsl = loadXMLDoc(xslFilename);
    // Internet Explorer handling
    if (window.ActiveXObject || xhttp.responseType === "msxml-document")
    {
        // IE5 and 6
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
}

