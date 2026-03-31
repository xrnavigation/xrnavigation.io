---
title: "Audiom Implementation Process"
date: 2024-11-05
lastmod: 2024-11-05
slug: "implementation"
draft: false
---

# Audiom Implementation Process

## Implementation Process from a PDF File

1.  The XR Navigation team will take the provided PDF and convert it into something Audiom can use. This includes:
    -   Converting the PDF into computer-readable “vector data”. [Here’s a blog post that details the PDF map vectorization process (Opens a new tab)](/how-to-convert-from-a-pdf-map-to-a-vector-data-map/). This means manually redrawing the PDF picture in a map program so it looks something like: “\[\[\[1,1\], \[1,2\], \[2,2\], \[2,1\], \[1,1\]\]\]”. You will then be given the vector data that you will be able to use in other map tools if desired.
    -   Adding attributes to customize the data source to the location. This would be making sure the features have their correct type (e.g., restaurant). It also means that their name is meaningful. If the name is “G23”, we can’t just show “G23”, we need to add context like “Room G23”.
    -   Creating a unique auditory experience that sounds as amazing as the visual experience looks.
    -   If illustration is included in the process, we will have a map artist manually add textures and depth to the map features.
    -   ![Two simplified maps of a playground: the left map is monochrome with basic shapes, while the right map is a colored and detailed illustration.](/images/playground.png)
        
2.  We will provide a line of code that you can embed on any app or website to either completely replace or supplement the existing map viewer to make it accessible. This line of code will be an iFrame and [the end result will look similar to how this map looks on our website (Opens a new tab)](/vrate24). If you need the map self-hosted, we can do that as well in limited circumstances.

## Implementation Process from a Data Source That’s Not a PDF

1.  You provide us your existing Geographic or numeric/categorical data.
    -   If you have a static map that only updates a few times a year, then just give us the data you currently have. If you need a baselayer, our team can help curate one for you.
    -   If you have an ESRI or other live Geographic data source, then we need a live endpoint that serves a Geojson or other vector data with all the points, polygons, and lines.
    -   If you have a database serving numeric or categorical data that updates more than twice a year, give us a live endpoint we can access.
2.  Our team will create a rules file that will help Audiom name features with context. For example, if the feature has a name property of “G21”, and a class property of “room”, we tell Audiom to render “Room G21”. Just having “G21” by itself is not helpful.
3.  We will provide a line of code that you can embed on any app or website to either completely replace or supplement the existing map viewer to make it accessible. This line of code will be an iFrame and [the end result will look similar to how this map looks on our website (Opens a new tab)](/vrate24). If you need the map self-hosted, we can do that as well in limited circumstances.

## Implementation Process for a Digital Map Tool

1.  Provide us an endpoint to your existing geographic data source.
2.  Our team will create a rules file that will help Audiom name features with context. For example, if the feature has a name property of “G21”, and a class property of “room”, we tell Audiom to render “Room G21”. Just having “G21” by itself is not helpful.
3.  We will work with you to either
    -   Fully integrate the Audiom functionality into your existing map viewer, with the Audiom software development kit, or
    -   Add a button to the current map viewer that says “Activate Inclusive Map”. This will open a dialogue or tab with the Audiom map showing your data.
