---
title: "How to Convert from a PDF Map to a Vector Data Map"
date: 2024-08-17
lastmod: 2024-10-03
slug: "how-to-convert-from-a-pdf-map-to-a-vector-data-map"
url: /how-to-convert-from-a-pdf-map-to-a-vector-data-map/
draft: false
---

Many maps are created using paint or other drawing tools and then saved as PDFs for sharing. The issue is that PDF maps are not computer-readable, which creates several barriers. This post will discuss why you should convert PDF maps to vector data and show how to do this process.

## What is Geographic Vector Data?

Geographic vector data represents geographic features using points, lines, and polygons. This data is important because it allows for interactive maps and other benefits listed below. Vector data can be easily edited and used in various applications outside a PDF reader. Vector data is a valuable tool for cartography and geographic information systems (GIS).

## Why Convert PDF Maps to Vector Data

1.  **Interactive Maps**: Vector data allows for interactive maps that users can zoom in and out of, and features users can click on for more information.
2.  **Accessibility**: Vector data can be used to create accessible maps for blind, low-vision, keyboard only, and mobile phone users.
3.  **Accurate Wayfinding Solutions**: Vector data is the first step in creating a wayfinding solution.
4.  **Editable Data**: Unlike static PDF maps, vector data can be easily edited and updated, ensuring the map is always current.
5.  **Layers**: Vector data supports the creation of layers that can be turned on and off, depending on what the user needs.

## Converting from PDF to Vector Data

Converting from PDF to vector data requires a tedious manual process. There are two options to convert from a PDF file to vector data:

1.  Hiring a cartographer to do the conversion. This is recommended for all data, especially anything with more than 10 or so objects on it.
2.  Doing the conversion yourself. This is possible, but will take a while and require you to learn a GIS program like QGIS.

### Contracting a Cartographer to Convert PDF to Vector Data

When searching for someone with the skills to convert from a PDF to a vector data map, you should look for the following: cartographer, GIS Professional/Consultant/Annalist/processor, Digital Map Maker, Geospatial Data Analyst, and anything else that sounds similar. You can find a company, like [XR Navigation (Opens a New Tab)](/), [Oakum Solutions (Opens a New Tab),](https://oakumsolutions.com) or find a freelancer on a site like [Upwork (Opens a New Tab)](https://www.upwork.com). If you’re converting indoor maps, you’re going to want them to convert the data into [valid Indoor Mapping Data Format (IMDF) (Opens a New Tab).](https://register.apple.com/resources/imdf/) This is a standardized indoor map format that indoor map viewers, like [Audiom (Opens a New Tab)](/) can show by default. You’re also going to want the cartographers to geo-reference the data. Additionally, if the PDF map is of an outdoor space, you can ask the cartographer to use as much [OpenStreetMap data as possible (Opens a New Tab).](https://www.openstreetmap.org/) More accurate data they can get from OpenStreetMap, the less they will need to create by hand and the less expensive the project will be.

### Converting the PDF Map By Hand

Converting a PDF by hand is tedious and time-consuming, but [here is a guide that goes step by step through the PDF to vector data conversion process using free tools (Opens a New Tab)](/how-to-convert-from-pdf-to-geojson-using-qgis/).

## What to Do With Vector Data

Once you have created your vector data Geojson file, you can upload it to [geojson.io (Opens a New Tab)](https://geojson.io) (a free map editor) to make edits. You can also [contact us to put that vector data into Audiom, so you have an fully inclusive digital map (Opens a New Tab).](/contact)
