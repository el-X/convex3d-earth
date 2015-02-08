<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:variable name="pinScale" select="0.008"/>

    <xsl:template match="/">
        <!-- Definition of an pin for a capital -->
        <Group DEF="PIN">
            <xsl:element name="Transform">
                <xsl:attribute name="scale">
                    <xsl:value-of select="$pinScale"/>,
                    <xsl:value-of select="$pinScale"/>,
                    <xsl:value-of select="$pinScale"/>
                </xsl:attribute>
                <Transform translation="0 4 0">
                    <Shape>
                        <Appearance>
                            <Material diffuseColor="red" specularColor=".5 .5 .5"></Material>
                        </Appearance>
                        <Sphere radius="1"></Sphere>
                    </Shape>
                </Transform>
                <Transform translation="0 1.5 0">
                    <Shape>
                        <Appearance>
                            <Material diffuseColor="green" specularColor=".5 .5 .5"></Material>
                        </Appearance>
                        <Cylinder radius="0.2" height="3.0"></Cylinder>
                    </Shape>
                </Transform>
            </xsl:element>
        </Group>
        <!-- Actual generation of capitals pins -->
        <xsl:call-template name="generatePins"/>
    </xsl:template>

    <xsl:template name="generatePins">
        <!-- Dummy pin bremen -->
        <Transform rotation="0 1 0 0.14827777777777779">
            <Transform rotation="1 0 0 0.6332333333333333">
                <Transform translation="0 1.00078481 0" onclick="alert('Bremen');">
                    <Shape USE="PIN"></Shape>
                </Transform>
            </Transform>
        </Transform>
    </xsl:template>

</xsl:stylesheet>
