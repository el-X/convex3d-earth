<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:variable name="comma">&#44;</xsl:variable>
    <xsl:variable name="hyphen">&#45;</xsl:variable>
    <xsl:variable name="space">&#160;</xsl:variable>

    <xsl:variable name="firstPart" select="'AÅBCDEFG'"/>
    <xsl:variable name="secondPart" select="'HIJKLMNOPQ'"/>
    <xsl:variable name="thirdPart" select="'RSTUVWYZ'"/>

    <xsl:template match="/">
        <xsl:element name="html">
            <xsl:call-template name="countriesTable"/>
        </xsl:element>
    </xsl:template>

    <xsl:template name="countriesTable">
        <xsl:element name="table">
            <xsl:attribute name="width">
                100%;
            </xsl:attribute>
            <table>
                <tr>
                    <th style="text-align:left; width: 33%; color:white;">
                        <b>A - G</b>
                    </th>
                    <th style="text-align:left; width: 33%; color:white;">
                        <b>H - Q</b>
                    </th>
                    <th style="text-align:left; width: 33%; color:white;">
                        <b>R - Z</b>
                    </th>
                </tr>
                <tr>
                    <td style="color:white;" valign="top">
                        <xsl:call-template name="for-each-character">
                            <xsl:with-param name="data" select="$firstPart"/>
                        </xsl:call-template>
                    </td>
                    <td style="color:white;" valign="top">
                        <xsl:call-template name="for-each-character">
                            <xsl:with-param name="data" select="$secondPart"/>
                        </xsl:call-template>
                    </td>
                    <td style="color:white;" valign="top">
                        <xsl:call-template name="for-each-character">
                            <xsl:with-param name="data" select="$thirdPart"/>
                        </xsl:call-template>
                    </td>
                </tr>
            </table>
        </xsl:element>
    </xsl:template>

    <!-- Recursive template. Depth is the length of the characters string. -->
    <xsl:template name="for-each-character">
        <xsl:param name="data"/>
        <!-- Check characters string for content before proceed -->
        <xsl:if test="string-length($data) &gt; 0">
            <!-- Pick the first letter of the string -->
            <xsl:variable name="letter" select="substring($data, 1, 1)" />
            <h3>
                <xsl:value-of select="$letter"/>
            </h3>
            <ul>
                <xsl:for-each select="/countries/country">
                    <xsl:sort select="name"/>
                    <xsl:variable name="country" select="name"/>
                    <xsl:if test="starts-with(substring($country, 1, 2), $letter)">
                        <li>
                            <b>
                                <xsl:element name="a">
                                    <xsl:attribute name="href">
                                        <!-- See wikiEventHandler.js -->
                                        javascript:Wiki.showPage("<xsl:value-of select="$country"/>");
                                    </xsl:attribute>
                                    <font color="white">
                                        <xsl:value-of select="$country"/>
                                    </font>
                                </xsl:element>
                            </b>
                            <xsl:value-of select="concat($space, $hyphen, $space)"/>
                            <xsl:choose>
                                <xsl:when test="capital/name != ''">
                                    <xsl:element name="a">
                                        <xsl:attribute name="href">
                                            <!-- See wikiEventHandler.js -->
                                            javascript:Wiki.showPage("<xsl:value-of select="concat(capital/name, $comma, $space, $country)"/>");
                                        </xsl:attribute>
                                        <font color="white">
                                            <xsl:value-of select="capital/name"/>
                                        </font>
                                    </xsl:element>
                                </xsl:when>
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
                <xsl:with-param name="data" select="substring($data, 2)"/>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>
