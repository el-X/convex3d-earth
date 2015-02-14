<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:variable name="comma">&#44;</xsl:variable>
    <xsl:variable name="space">&#160;</xsl:variable>

    <xsl:variable name="pinScale" select="0.004"/>
    <xsl:variable name="PI" select="number(3.14159265359)"/>

    <!-- Creates markings for capitals by defining a pin and using it for each capital. -->
    <xsl:template match="/">
        <!-- Define the X3D model of a pin. -->
        <Group DEF="PIN">
            <xsl:element name="Transform">
                <!-- The scaling of the pins is done by applying a factor to the x, y and z coordinates -->
                <xsl:attribute name="scale">
                    <xsl:value-of select="$pinScale"/>,
                    <xsl:value-of select="$pinScale"/>,
                    <xsl:value-of select="$pinScale"/>
                </xsl:attribute>
                <!-- The pin head is a simple sphere. -->
                <Transform translation="0 4 0">
                    <Shape>
                        <Appearance>
                            <Material diffuseColor="red" specularColor=".5 .5 .5"></Material>
                        </Appearance>
                        <Sphere radius="1"></Sphere>
                    </Shape>
                </Transform>
                <!-- The pin tip on the other hand is a cylinder. -->
                <Transform translation="0 1.5 0">
                    <Shape>
                        <Appearance>
                            <Material diffuseColor="silver" specularColor=".5 .5 .5"></Material>
                        </Appearance>
                        <Cylinder radius="0.2" height="3.0"></Cylinder>
                    </Shape>
                </Transform>
            </xsl:element>
        </Group>
        <!-- Actual generation of the pins for the capitals -->
        <xsl:call-template name="generatePins"/>
    </xsl:template>

    <!--
        For a better understanding take a look at:
            http://en.wikipedia.org/wiki/Spherical_coordinate_system
            http://en.wikipedia.org/wiki/Latitude
            http://en.wikipedia.org/wiki/Longitude
    -->
    <!-- Generates capital pins for all countries. -->
    <xsl:template name="generatePins">
        <xsl:for-each select="/countries/country">
            <xsl:variable name="capitalLatitude" select="number(capital/latitude)"/>
            <xsl:variable name="capitalLongitude" select="number(capital/longitude)"/>

            <xsl:if test="string($capitalLatitude)!='NaN' and string($capitalLongitude)!='NaN'">
                <!-- Conversion from degrees to radians. -->
                <xsl:variable name="latitudeAngle">
                    <!-- the following conversion formula is a short form for:    -->
                    <!-- ((180.0 * $PI) - ($capitalLatitude * 2 * $PI)) div 360.0 -->
                    <!-- the calculation is based on the fact that latitudes have -->
                    <!-- a max range of 180° -->
                    <xsl:value-of select="((90.0 - $capitalLatitude) * $PI) div 180.0"/>
                </xsl:variable>
                <xsl:variable name="longitudeAngle">
                    <!-- the longitude radian can be calculated the normal way: -->
                    <!-- ($capitalLongitude * 2 * $PI) div 360.0                -->
                    <xsl:value-of select="($capitalLongitude * $PI) div 180.0"/>
                </xsl:variable>

                <!-- 2 rotations and 1 translation are needed for     -->
                <!-- properly placing the pins on the earth's surface -->
                <Transform>
                    <!-- first rotate around the y-axis by the $longitudeAngle -->
                    <xsl:attribute name="rotation">
                        0 1 0 <xsl:value-of select="$longitudeAngle"/>
                    </xsl:attribute>
                    <Transform>
                        <!-- then rotate around the x-axis by the $latitudeAngle -->
                        <xsl:attribute name="rotation">
                            1 0 0 <xsl:value-of select="$latitudeAngle"/>
                        </xsl:attribute>
                        <!-- at last move the pin to the surface (y -> 1 since the earth's radius is 1) -->
                        <Transform translation="0 1 0">
                            <!-- Use the shape definition of the pin for the capital -->
                            <Shape USE="PIN"></Shape>
                            <!-- Generate an invisible box surrounding the pin for click events. -->
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
        Create a clickable transparent box that surrounds the pin. Onlick actions
        that call the wiki page of that capital can be triggered much more easily,
        because the box is easier to reach with the mouse than the actual pin itself.
    -->
    <xsl:template name="generateClickableBox">
        <xsl:param name="country"/>
        <Shape>
            <Appearance>
                <Material transparency="1.0" />
            </Appearance>
            <Box>
                <!-- Look if there is a special wiki search string for the capital  -->
                <xsl:variable name="wikiSearch">
                    <xsl:choose>
                        <xsl:when test="boolean(capital/wikiName)">
                            <xsl:value-of select="capital/wikiName"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <!-- If that is not the case, simply use the capital name -->
                            <xsl:value-of select="capital/name"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:attribute name="onclick">
                    <!-- See wikiEventHandler.js -->
                    javascript:Wiki.showPage("<xsl:value-of select="$wikiSearch"/>");
                </xsl:attribute>
                <!-- Make the box bigger than the pin in order to provide better user interaction. -->
                <xsl:attribute name="size">
                    <xsl:value-of select="number($pinScale) * 4"/>,
                    <xsl:value-of select="number($pinScale) * 12"/>,
                    <xsl:value-of select="number($pinScale) * 4"/>
                </xsl:attribute>
            </Box>
        </Shape>
    </xsl:template>
</xsl:stylesheet>