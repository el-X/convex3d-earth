
function Wiki() {
}
;

/**
 * Fills the wiki frame (on the right hand side of the website) with a WikiPage
 * for the specific country or capital.
 *
 * @param name of the country or capital
 */
Wiki.showPage = function (name) {
    var sideLink = "http://en.m.wikipedia.org/wiki/";
    var fullLink = "http://en.wikipedia.org/wiki/";

    var wikiLink = document.getElementById("outlink");
    var wikiFrame = document.getElementById("wikiFrame");

    document.getElementById("info").style.display = "none";

    wikiLink.href = fullLink + name;
    wikiLink.style.display = "block";
    wikiFrame.src = sideLink + name;
    window.scrollTo(0, 0);
};

/**
 * Resets the wikiFrame on page load/reload.
 * This is needed due to the fact that a country/capital selection followed
 * by a page reload causes the content of the wikiFrame not to disappear.
 */
Wiki.resetInfoView = function () {
    var wikiFrame = document.getElementById("wikiFrame");
    wikiFrame.src = "";
    var wikiLink = document.getElementById("outlink");
    wikiLink.style.display = "none";
};

