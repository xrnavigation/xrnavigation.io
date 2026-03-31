---
title: "How to Make Detailed Map Text Descriptions"
date: 2024-08-02
lastmod: 2025-11-01
slug: "how-to-make-detailed-map-text-descriptions"
url: /how-to-make-detailed-map-text-descriptions/
draft: false
---

This post explains how to create detailed map descriptions and discusses their pros and cons. The instructions are based on both [the landmark, route, and survey knowledge framework (Opens in a new tab)](/how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples) and [the audio description guide from UniDescription project (Opens in a new tab)](https://unidescription.org/unid-academy#learn-about-audio-description-genres-maps).

Detailed map text descriptions provide a comprehensive description of a map. They are written on a single page with headings and a table of contents.

## Pros and Cons of Detailed Descriptions

### Pros

1.  Detailed map text descriptions are the least technical option.
2.  They can be viewed on any device, including email.
3.  The concept is easy to communicate.

### Cons

1.  They take time and money to create.
2.  They are static and don’t show dynamic data.
3.  They require a thoughtful indexing strategy.
4.  [They are a separate but equal solution. Companies have lost American’s With Disabilities Act (ADA) lawsuits using separate but equal solutions (Opens in a new tab).](https://sheribyrnehaber.medium.com/accessibility-separate-but-equal-is-never-ok-e6e97d893d11)
5.  They need to be written in easy-to-read language.
6.  It’s hard to provide the same resolution as a visual map.
7.  They are difficult and costly to maintain.
8.  They are not inclusive.
9.  They are difficult for disabled users to find.

## Alternatives to Detailed Map Text Descriptions

[Audiom is an inclusive digital map viewer (Opens in a new tab)](/home) that uses interactive alternate text to solve most of the above issues. The text experience is automatically generated from the same data powering the visual map. Any update to the visual map will automatically show on the text map. Audiom can show real-time updates and data. Resolution is as detailed as the data. The visual and non-visual interfaces are together. Despite this, text descriptions are useful in some circumstances.

### When to Use Detailed Text Descriptions

Use detailed text descriptions when:

1.  An interactive application or link to an external website is not possible.
2.  Everyone is using the text description (there’s no visual map).

## Guide to Detailed Text Descriptions

### Goals

The goals of the detailed text description map are:

1.  Provide the same spatial information that’s in the geographic data. There’s an easy way to tell if you did this well. Can someone who has not seen the visual map, redraw the map with 90% accuracy after reading the description?
2.  Provide an easy-to-use description that’s useful for the main purposes of the map.

### General Considerations

1.  Use clockface directions as well as saying “left” or “right”. Clockface directions give more information. Left and right on their own is OK if the object is 180 degrees on a direction, like in a hallway.
2.  Using proper nested headings makes it easier to generate a table of contents. It also makes it easier to jump through the contents with a screen reader.
3.  [Write at an 8th grade level or below to be understandable by people with reading disabilities, limited English skills, or limited education (Opens a new tab)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-supplements.html). You can use tools like the [Hemingway editor to evaluate the reading level of the text (Opens a new tab)](https://hemingwayapp.com/).

### Step 1: Create a Synopsis

Create a 2-4 sentence summary describing what is in the map and what users can expect. This allows users to decide if they want to continue reading. It’s like a first glance at a visual map.

### Step 2: Create Your Landmark, Route, and Survey Knowledge Template

Create three headings to place data under:

1.  **Landmark**: Sensory characteristics, name, type, shape, size, orientation, borders, numeric values, categorical values, and Temporal information if applicable, of all features on the map.
2.  **Route**: Describe any defined routes if applicable. Make sure these routes follow all the landmark and survey knowledge requirements, and make sure they are very quick and easy to find (They are not 10 headings into the description, for example).
3.  **Survey**: The overall understanding of how all the features (points, polygons, and lines) relate through their distance, direction, topological information (The interior, boundary, and exterior information), and absolute location (e.g., coordinates or relation to graticule lines) on the map.

### Step 3: Complete Items Under the Landmark Heading

The landmark heading will contain all the features in the map with their name as the heading. Each name should be unique. This includes any points, polygons, or lines on the map. All rooms, elevators, stairs, hallways, and designated routes need to be listed. If there are two items of the same name, they can be called “Southeast Staircase” or even “Staircase 1”. Headings can be combined, or this entire area can be one paragraph, but all the information needs to be present.

Under each name heading, there should be headings for the following items:

-   **Sensory characteristics**: What visual, auditory, tactile, or smell aspects are there to this feature? If it’s an elevator, describe where the call buttons are and where the button pads are in the elevator. If it’s a food cart, describe the smell or sounds the user could hear to recognize it. If this is a large-scale map, then describe the topography.
-   **Type**: This can be a single word to describe the different objects. It could be “Exhibit”, “Elevator”, “Walkway”, etc. Sometimes features have strange names, and this tells the user what kind of thing they are viewing.
-   **Shape**: Describe in detail the shape of the feature. If it’s a simple rectangle, you’re lucky. But when describing the state of Idaho, for example, the slant on the top left needs to be described with the same detail as the visual map.
-   **Orientation**: Describe how the object is facing. Use clockface directions whenever possible. Also describe where this feature is in relation to other landmarks that are important in the space.
-   **Topological information**: Describe what features are bordering this one and where. If other features are inside this feature, describe their positions, if this feature is inside another feature, describe its position relative to the larger feature, and describe any adjacent bordering features. Use clockface directions if needed.
-   **Numeric values**: If this is a thematic map, describe the numeric or categorical values associated with this feature. This would be something like: 250,000 cases per one million, or something similar. There can also be a table here with the different values. Additionally, a table should be provided separately with all the features and their associated values.
-   Temporal information: If there is data that changes over time, either through features moving, or their numeric values changing, then have a way to change the date and view the change over time in text. It would also be helpful to have an overview of particular trends that happen in the data over time. Additional tools, such as [Highcharts (Opens a new tab)](https://www.highcharts.com/) or [Maidr (Opens a new tab)](https://github.com/xability/maidr) can be used to present the numeric time sequenced data.
-   **Size**: How big in inches, feet, meters, miles, or kilometers is this feature? Give the overall size. If it is an odd shape, this can be part of the shape aspect as well.

### Step 4: Complete Route Knowledge Heading

The point of the route knowledge heading is to make sure users can trace or navigate from one feature to another along a defined route. If there are no routes on the map, then skip this section. The best approach is to have a list of defined routes, including every feature that is along the routes. It’s possible to shorten this section if there are few features, or if there’s only one pathway through the entire space.

### Step 5: Complete Survey Knowledge

The reason for this heading is to provide the distance, direction, topological information, and location of all the points, polygons, and lines related to each other. There are two ways to provide this information:

1.  Split the map into squares and describe each square. The simplest layout is a 3 by 3 grid, but other designations can be used. The issue with this method is that the goal is to have the same resolution as the existing visual map, and this method may be too broad.
2.  Use a single point of reference and describe as the crow flies directions to every other feature on the map. The clearest directions are saying something like 15 meters north and 6 meters east. Saying something like 13 meters northeast is not as understandable to users.

## Conclusion

[Here’s an example of a detailed text description (Opens a new tab)](/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific).

Remember that the goal of this description is to provide the “equivalent purpose” to the visual map. This includes the primary purpose of the map, as well as any other use. A university campus map could be used for more than just routes between buildings. It can be used for evaluating the distribution of garbage cans on the campus. It could also be used to tell students where to line up for graduation. Remember to keep the text description up-to-date with the visual map. If a description seems too difficult, there are simpler dynamic options, such as [Audiom (Opens a new tab).](/home) [Please contact us if you have any questions about creating a detailed text description or want to explore other options (Opens a new tab)](/contact).
