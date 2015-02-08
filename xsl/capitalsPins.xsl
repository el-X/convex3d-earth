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

        <!-- Dummy pin bremen -->
        <Transform rotation="0 1 0 0.14827777777777779">
            <Transform rotation="1 0 0 0.6332333333333333">
                <Transform translation="0 1 0">
                    <xsl:attribute name="onclick">alert('Bremen <xsl:value-of select="$PI"/>');</xsl:attribute>
                    <Shape USE="PIN"></Shape>
                </Transform>
            </Transform>
        </Transform>

        <!-- Generate pin for each country capital -->
        <xsl:for-each select="/countries/country">

            <xsl:variable name="capitalLongitude" select="number(@longitude)"/>
            <xsl:variable name="capitalLatitude" select="number(@latitude)"/>

            <xsl:if test="string($capitalLongitude)!='NaN' and string($capitalLatitude)!='NaN'">

                <xsl:variable name="longitudeAngle">
                    <xsl:value-of select="(capitalLongitude * $PI) div 180.0"/>
                </xsl:variable>
                <xsl:variable name="latitudeAngle">
                    <xsl:value-of select="((90 - capitalLatitude) * $PI) div 180.0"/>
                </xsl:variable>

                <!-- 2 rotations (params x y z angle) -->
                <Transform>
                    <!-- $longitudeAngle for a rotation around the y -->
                    <xsl:attribute name="rotation">
                        0 1 0 <xsl:value-of select="$longitudeAngle"/>
                    </xsl:attribute>
                    <Transform>
                        <!-- $latitudeAngle for a rotation around the x -->
                        <xsl:attribute name="rotation">
                            1 0 0 <xsl:value-of select="$latitudeAngle"/>
                        </xsl:attribute>
                        <!-- Move the pin to the earth surface (y->1 since the earth radius is 1) -->
                        <Transform translation="0 1 0">
                            <!-- Onlick attribute to call wikiEventHandler.js -->
                            <xsl:attribute name="onclick">
                                <!-- See wikiEventHandler.js -->
                                javascript:Wiki.showPage("<xsl:value-of select="concat(@capital, $comma, $space, @countryName)"/>");
                            </xsl:attribute>
                            <!-- Using the shape definition of the pin for the capital -->
                            <Shape USE="PIN"></Shape>
                        </Transform>
                    </Transform>
                </Transform>
            </xsl:if>

        </xsl:for-each>

    </xsl:template>

</xsl:stylesheet>