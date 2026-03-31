---
title: "How to Convert from PDF to Geojson Using QGIS"
date: 2024-10-03
lastmod: 2024-10-04
slug: "how-to-convert-from-pdf-to-geojson-using-qgis"
url: /how-to-convert-from-pdf-to-geojson-using-qgis/
draft: false
---

## Using Qgis

This guide presents the steps on converting a PDF or picture map to vector data that is computer readable. vectorized data can be used for creating interactive maps, routing functionality, accessible maps, and scales better between mobile and desktop devices. Tools like  [Audiom (Opens a New Tab)](/), require vector data to run. [QGIS(Opens a New Tab)](https://qgis.org/) is a free and open source map creation tool that will be used in this guide. Note that [QGIS(Opens a New Tab)](https://qgis.org/) can be used to create maps from scratch, it is not only a PDF to vector data tool.

Although it is possible to vectorize your own data, it is recommended for more complex maps that a professional cartographer from [XR Navigation(Opens a New Tab)](/) or any other cartography company be used. Formats like [indoor mapping data format (Opens a New Tab](https://register.apple.com/resources/imdf/)) are standardized ways of making multi-level building data that is more advanced than what this guide teaches.

## **Setting Up Your Project**

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'); li { font-family: 'Roboto', sans-serif; }

1.  [Download the free QGIS for your platform (Opens a new tab)](https://qgis.org/download/)
  
3.  To open the PDF or image map, click **Layer** -> **Add Layer** -> **Add Raster Layer…**  
    ![In the QGIS menu, Layer is highlighted and the Add Raster Layer option is selected.](/images/In-the-QGIS-menu-Layer-is-highlighted-and-the-Add-Raster-Layer-option-is-selected.png)
  
5.  In the **Source** section, the **Raster dataset(s)** menu and the **Browse** button are located at the top of the settings panel.  
    ![Source selection window in QGIS with the Raster dataset(s) field and the 'Browse' button highlighted](/images/Source-selection-window-in-QGIS-with-the-Raster-datasets-field-and-the-Browse-button-highlighted.png)
  
7.  Select a floor plan in image or PDF format and click **Open**. Then click **Add**.  
    ![Selecting a floor plan file in image or PDF format in the file explorer.](/images/Selecting-a-floor-plan-file-in-image-or-PDF-format-in-the-file-explorer.png)
  
9.  Close the **Add Raster Layer** window. You should now see the building plan.
  
11.  To access **Layer** -> **Create Layer** -> **New Shapefile Layer…**, the **Layer** menu is located at the top left of the QGIS window, in the main menu bar.  
     ![The Layer menu in QGIS with the Create Layer option highlighted and New Shapefile Layer selected.](/images/The-Layer-menu-in-QGIS-with-the-Create-Layer-option-highlighted-and-New-Shapefile-Layer-selected.png)
  
13.  In the **File name** field, specify the name of the file. Set **File encoding** to **UTF-8**, **Geometry type** to **Polygon**, and **CRS** to **EPSG:4326 – WGS 84**, then click **OK**.  
     ![New Shapefile Layer setup window, with parameters: file name, UTF-8 encoding, Polygon geometry type and EPSG:4326 coordinate system.](/images/New-Shapefile-Layer-setup-window-with-parameters-file-name-UTF-8-encoding-Polygon-geometry-type-and-EPSG4326-coordinate-system.png)
  
15.  Right-click the new layer and click **Toggle Editing**.  
     ![Layer context menu in QGIS, with the Toggle Editing option highlighted.](/images/Layer-context-menu-in-QGIS-with-the-Toggle-Editing-option-highlighted.png)
  
17.  Click **View** (located at the top left), then go to **Toolbars** and enable the following toolbars: **Advanced Digitizing Toolbar**, **Shape Digitizing Toolbar**, and **Attributes Toolbar**.  
     ![View menu in QGIS with open options to enable Advanced Digitizing Toolbar, Shape Digitizing Toolbar and Attributes Toolbar.](/images/View-menu-in-QGIS-with-open-options-to-enable-Advanced-Digitizing-Toolbar-Shape-Digitizing-Toolbar-and-Attributes-Toolbar.png)

## **Creating and Exporting Your Map**

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'); li { font-family: 'Roboto', sans-serif; }

1.  Click the **Add Polygon** button and select a shape (e.g., square).  
    ![Add Polygon tool in the QGIS toolbar with the Add Polygon button highlighted.](/images/Add-Polygon-tool-in-the-QGIS-toolbar-with-the-Add-Polygon-button-highlighted.png)
  
3.  **Left-click** to start drawing the shape. When done, **right-click** to finish drawing the shape.  
    ![The process of creating a polygon shape on a map in QGIS with the cursor performing clicks to add vertices.](/images/The-process-of-creating-a-polygon-shape-on-a-map-in-QGIS-with-the-cursor-performing-clicks-to-add-vertices.png)
  
5.  Click the **Open Attribute Table** button. Then click **Add Field** and create a new attribute called “name”. Set the type to **Text (string)** with a length of 255 characters.  
    ![Open attribute table in QGIS with the Add Field button highlighted to add a new attribute.](/images/Open-attribute-table-in-QGIS-with-the-Add-Field-button-highlighted-to-add-a-new-attribute.png)  
    ![A window for adding a new field to the QGIS attribute table with the following fields filled in: name 'name', type Text and length 255 characters.](/images/A-window-for-adding-a-new-field-to-the-QGIS-attribute-table-with-the-following-fields-filled-in-name-name-type-Text-and-length-255-characters.png)
  
7.  Set the name for the first shape. For future shapes, assign the name and IDs directly in the popup window that appears after creating the shape.  
    
  
9.  Repeat the process to create all required objects on the map.
  
11.  After creating the shapes, right-click your layer, select **Export** -> **Save Features As…**, choose a file name, set the format to **GeoJSON**, and click **OK**. Geo-referencing is done when selecting the **CRS** (coordinate reference system) during the creation of the layer or when saving the file.  
     ![Layer context menu in QGIS with Export highlighted and Save Features As selected.](/images/Layer-context-menu-in-QGIS-with-Export-highlighted-and-Save-Features-As-selected.png)
  
13.  Your data is now saved and can be exported to **Audiom**. Give the GeoJSON file to the Audiom team, and that will be used as your map.

## References

[Guide to converting PDF to vector data (Opens a New Tab)  
](https://support.app.sympheny.com/user-guide/latest/how-to-transform-pdf-files-to-geojson-and-upload-t)[Audiom — XR Navigation (Opens a New Tab)  
](/)[Indoor Mapping Data Format Specification (Opens a New Tab)  
](https://register.apple.com/resources/imdf/)[QGIS Official Documentation (Opens](https://docs.qgis.org/latest/en/docs/index.html) [a New Tab)  
](https://docs.qgis.org/latest/en/docs/index.html)[GeoJSON](https://geojson.org/) [Specification](https://geojson.org/) [(Opens a New Tab)  
](https://geojson.org/)[EPSG.io for CRS (Opens a New Tab)](https://epsg.io/)
