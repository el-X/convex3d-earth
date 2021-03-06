<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:variable name="comma">&#44;</xsl:variable>
    <xsl:variable name="hyphen">&#45;</xsl:variable>
    <xsl:variable name="space">&#160;</xsl:variable>

    <xsl:variable name="firstColumn" select="'AÅBCDEFG'"/>
    <xsl:variable name="secondColumn" select="'HIJKLMNOPQ'"/>
    <xsl:variable name="thirdColumn" select="'RSTUVWYZ'"/>

    <xsl:template match="/">
        <xsl:element name="html">
            <xsl:call-template name="countryTable"/>
        </xsl:element>
    </xsl:template>

    <!-- Creates a table containing all available countries and capitals -->
    <xsl:template name="countryTable">
        <xsl:element name="table">
            <table>
                <tr>
                    <th>A - G</th>
                    <th>H - Q</th>
                    <th>R - Z</th>
                </tr>
                <tr>
                    <td>
                        <xsl:call-template name="for-each-character">
                            <xsl:with-param name="characters" select="$firstColumn"/>
                        </xsl:call-template>
                    </td>
                    <td>
                        <xsl:call-template name="for-each-character">
                            <xsl:with-param name="characters" select="$secondColumn"/>
                        </xsl:call-template>
                    </td>
                    <td>
                        <xsl:call-template name="for-each-character">
                            <xsl:with-param name="characters" select="$thirdColumn"/>
                        </xsl:call-template>
                    </td>
                </tr>
            </table>
        </xsl:element>
    </xsl:template>

    <!-- Recursive template. The depth of the recursion is the length of the character string. -->
    <xsl:template name="for-each-character">
        <xsl:param name="characters"/>
        <!-- Check character string for content before proceeding -->
        <xsl:if test="string-length($characters) &gt; 0">
            <!-- Pick the first letter of the string -->
            <xsl:variable name="character" select="substring($characters, 1, 1)"/>
            <h3>
                <xsl:value-of select="$character"/>
            </h3>
            <ul>
                <xsl:for-each select="/countries/country">
                    <xsl:sort select="name"/>
                    <xsl:variable name="country" select="name"/>
                    <xsl:if test="starts-with(substring($country, 1, 1), $character)">
                        <li>
                            <b>
                                <xsl:element name="a">
                                    <xsl:attribute name="href">
                                        <!-- See wikiEventHandler.js -->
                                        javascript:Wiki.showPage("<xsl:value-of select="$country"/>");
                                        javascript:Earth.showCountry(<xsl:value-of select="(concat(northLatitude, $comma, southLatitude, $comma, westLongitude, $comma, eastLongitude))"/>);
                                    </xsl:attribute>
                                    <font color="white">
                                        <xsl:value-of select="$country"/>
                                    </font>
                                </xsl:element>
                            </b>
                            <xsl:value-of select="concat($space, $hyphen, $space)"/>
                            <xsl:choose>
                                <xsl:when test="boolean(capital)">
                                    <!-- Determine if a special wiki search name is provided -->
                                    <xsl:variable name="wikiSearch">
                                        <xsl:choose>
                                            <xsl:when test="boolean(capital/wikiName)">
                                                <xsl:value-of select="capital/wikiName"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <!-- If there are no special search strings, the country -->
                                                <!-- name itself will be used as the search string       -->
                                                <xsl:value-of select="capital/name"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:variable>
                                    <xsl:element name="a">
                                        <xsl:attribute name="href">
                                            <!-- See wikiEventHandler.js -->
                                            javascript:Wiki.showPage("<xsl:value-of select="$wikiSearch"/>");
                                            javascript:Earth.showCountry(<xsl:value-of select="(concat(northLatitude, $comma, southLatitude, $comma, westLongitude, $comma, eastLongitude))"/>);
                                        </xsl:attribute>
                                        <font color="white">
                                            <xsl:value-of select="capital/name"/>
                                        </font>
                                    </xsl:element>
                                </xsl:when>
                                <!-- In case no capitals are available -->
                                <xsl:otherwise>N/A</xsl:otherwise>
                            </xsl:choose>
                            (<i>
                                <xsl:value-of select="continent"/>
                            </i>)
                        </li>
                    </xsl:if>
                </xsl:for-each>
            </ul>
            <xsl:call-template name="for-each-character">
                <!-- Cut off the first character of the string and proceed recursively -->
                <xsl:with-param name="characters" select="substring($characters, 2)"/>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>