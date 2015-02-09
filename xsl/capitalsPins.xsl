<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:variable name="comma">&#44;</xsl:variable>
    <xsl:variable name="space">&#160;</xsl:variable>

    <xsl:variable name="pinScale" select="0.008"/>
    <xsl:variable name="PI" select="number(3.14159265359)"/>

    <!-- Creates markups for capitals by defining an pin and using it for each capital. -->
    <xsl:template match="/">
        <!-- Definition of a pin for each capital. -->
        <Group DEF="PIN">
            <xsl:element name="Transform">
                <!-- Scaling of the pin. Done by setting x y z scalings.  -->
                <xsl:attribute name="scale">
                    <xsl:value-of select="$pinScale"/>,
                    <xsl:value-of select="$pinScale"/>,
                    <xsl:value-of select="$pinScale"/>
                </xsl:attribute>
                <!-- Pin head. -->
                <Transform translation="0 4 0">
                    <Shape>
                        <Appearance>
                            <Material diffuseColor="red" specularColor=".5 .5 .5"></Material>
                        </Appearance>
                        <Sphere radius="1"></Sphere>
                    </Shape>
                </Transform>
                <!-- Pin foot. -->
                <Transform translation="0 1.5 0">
                    <Shape>
                        <Appearance>
                            <Material diffuseColor="cyan" specularColor=".5 .5 .5"></Material>
                        </Appearance>
                        <Cylinder radius="0.2" height="3.0"></Cylinder>
                    </Shape>
                </Transform>
            </xsl:element>
        </Group>
        <!-- Actual generation of capitals pins -->
        <xsl:call-template name="generatePins"/>
    </xsl:template>

    <!--
        For undertanding see http://de.wikipedia.org/wiki/Kugelkoordinaten
                             http://de.wikipedia.org/wiki/Geographische_Breite
                             http://de.wikipedia.org/wiki/Geographische_L%C3%A4nge
    -->
    <!-- Generates capital pins for all countries. -->
    <xsl:template name="generatePins">

        <!-- Generate pin for each country capital -->
        <xsl:for-each select="/countries/country">
            <xsl:variable name="capitalLongitude" select="number(capital/longitude)"/>
            <xsl:variable name="capitalLatitude" select="number(capital/latitude)"/>

            <xsl:if test="string($capitalLongitude)!='NaN' and string($capitalLatitude)!='NaN'">

                <!-- Simple conversion of degrees to radians. -->
                <xsl:variable name="longitudeAngle">
                    <!--<xsl:value-of select="($capitalLongitude * 2 * $PI) div 360.0"/>-->
                    <xsl:value-of select="($capitalLongitude * $PI) div 180.0"/>
                </xsl:variable>
                <xsl:variable name="latitudeAngle">
                    <!--<xsl:value-of select="((180.0 * $PI) - ($capitalLatitude * 2 * $PI)) div 360.0"/>-->
                    <xsl:value-of select="((90.0 - $capitalLatitude) * $PI) div 180.0"/>
                </xsl:variable>

                <!-- 2 rotations (params x y z angle) -->
                <Transform>
                    <!-- $longitudeAngle for a rotation around the y-axis -->
                    <xsl:attribute name="rotation">
                        0 1 0 <xsl:value-of select="$longitudeAngle"/>
                    </xsl:attribute>
                    <Transform>
                        <!-- $latitudeAngle for a rotation around the x-axis -->
                        <xsl:attribute name="rotation">
                            1 0 0 <xsl:value-of select="$latitudeAngle"/>
                        </xsl:attribute>
                        <!-- Move the pin to the earth surface (y->1 since the earth radius is 1) -->
                        <Transform translation="0 1 0">
                            <!-- Using the shape definition of the pin for the capital -->
                            <Shape USE="PIN"></Shape>
                            <!-- Generate an invisible box over the pin for click event. -->
                            <xsl:call-template name="generateClickableBox">
                                <xsl:with-param name="country" select="."/>
                            </xsl:call-template>
                        </Transform>
                    </Transform>
                </Transform>
            </xsl:if>
        </xsl:for-each>
    </xsl:template>

    <!--
        Clickable transparent box over the pin with onlick action to call wikiEventHandler.js.
        The box provides better usability (pins are sometimes hard to reach with the mouse).
        Also needed for the onlick event, since the event propagates through all group elements.
    -->
    <xsl:template name="generateClickableBox">
        <xsl:param name="country"/>
        <Shape>
            <Appearance>
                <Material transparency="1.0" />
            </Appearance>
            <Box>
                <xsl:attribute name="onclick">
                    <!-- See wikiEventHandler.js -->
                    javascript:Wiki.showPage("<xsl:value-of select="concat($country/capital/name, $comma, $space, $country/name)"/>");
                </xsl:attribute>
                <!-- Make the box bigger than the pin to provide better user interaction. -->
                <xsl:attribute name="size">
                    <xsl:value-of select="number($pinScale) * 4"/>,
                    <xsl:value-of select="number($pinScale) * 12"/>,
                    <xsl:value-of select="number($pinScale) * 4"/>
                </xsl:attribute>
            </Box>
        </Shape>
    </xsl:template>

</xsl:stylesheet>
