---
title: "How to Systematically Evaluate The Text Accessibility of a Map With Examples"
date: 2024-07-26
lastmod: 2024-07-26
slug: "how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples"
url: /how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples/
layout: "audiom-embed"
audiom_id: 13
draft: false
---

Maps are complex visual tools that convey a lot of information. But how can we ensure their text alternatives are accessible?

Traditionally, making [geographic maps (Opens a new tab)](/what-is-the-definition-of-a-map/) accessible involves focusing on the “point” of the map. Is the alternative text conveying the primary objective? However, this approach is neither legal nor compliant with the [Web Content Accessibility Guidelines (WCAG) 1.1.1: Non-text Content (Opens a new tab)](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html). WCAG 1.1.1 states: “All non-text content that is presented to the user has a text alternative that serves the **equivalent purpose**.”

Instead of identifying the “primary” point, the non-visual version needs to be equal in every way to the visual version. But what does “equal” mean for a map? Thankfully, there is an answer.

## Defining What You Get from a Map

There is a [long-established practice of evaluating maps through spatial knowledge acquisition (Opens a new tab)](https://scholar.google.com/scholar?cites=13147064244181355139&as_sdt=80005&sciodt=0,11&hl=en). There are three types of spatial knowledge:

1.  **Landmark Knowledge**: Sensory characteristics, name, type, shape, orientation, and size of a particular feature or location on the map.
2.  **Route Knowledge**: How two landmarks connect, including distance, direction, legs of the route, and shape of the route.
3.  **Survey Knowledge**: Overall understanding of how all points, polygons, and lines relate through their distance, direction, shape, size, orientation, and general layout on the map.

Using this framework allows a quantitative evaluation of the spatial information in a map. Additionally, there needs to be full access to numeric or other information that may be overlaid on the geographic features. [Thematic maps often have numeric information overlayed (Opens in a new tab)](https://www.cdc.gov/dhdsp/maps/gisx/resources/thematic-maps.html). If an alternative is missing any of these elements, it’s not an equal alternative and not WCAG compliant.

## Examples

Let’s look at a few examples of text alternatives to see if they meet the criteria. [Here’s the map we’ll be looking at (Opens a new tab).](https://www.audiom.net/levelaccess) Note that this map does not contain sensory characteristics from Landmark knowledge, so we’ll ignore them in our evaluation:

#### Short text Description

A map of the U.S. with each state colored to show the amount of COVID-19 cases present at that location.

##### Evaluation of Short text Description

-   Spatial knowledge: This has the type of features to expect in landmark knowledge (states), but is missing all other elements of landmark, route and survey knowledge. We do know it’s of the U.S., but knowing that is not part of spatial knowledge.
-   Access to numeric values: This only says the map is looking at COVID-19 cases, not what the values are.
-   Verdict: Fail.

#### Simple table

COVID-19 Example Simple Table

Name

Total Cases

Washington

1975382

Minnesota

1817565

Oregon

974924

Nevada

904558

Idaho

525825

Wyoming

187858

Virginia

2315784

Massachusetts

2257300

Utah

1101767

##### Evaluation of a Simple Table

-   Spatial knowledge: There are the names of landmarks on the map, but the other elements of landmark, route, and survey knowledge are missing completely.
-   Access to numeric values: Assuming there is a way to change the columns to show the other columns this map has access to (e.g., Cases Per 1 Million, Total Deaths, etc.), this map alternative does provide information about these values.
-   Verdict: Fail.

#### Nearby Address Search

### Example Nearby Address Search App Screen (it doesn’t work)

Search an address or state and select the COVID-19 statistic to get information about that location.

Address or State  Example: 123 Fiction St. Billings Montana

Select Statistic –Please choose an option– Total Cases Total Deaths Total Recovered Active Cases

Submit

Here is what the results may look like:

-   Montana: 333,758 Total Cases
-   South Dakota: 282895 Total Cases, 309 miles
-   Wyoming: 187858 Total Cases, 326 Miles
-   North Dakota: 292604 Total Cases, 609 miles
-   …

##### Evaluation of Nearby Address Search

-   Spatial knowledge: This implementation gives distance and name, but lacks all other elements of spatial knowledge. If a text description describes the map before the address box, then there may also be type from landmark knowledge.
-   Access to numeric values: This does give all numeric values on the map.
-   Verdict: Fail.

#### Turn-by-Turn Directions

Turn-by-turn directions are normally used for navigation maps. Here is an example of what they may be for a COVID-19 map. The user starts in Billings Montanna:

-   Start at Billings Montanna facing south. Montanna has 333,758 Total Cases.
-   Go forward and move south 326 miles to Wyoming with 187858 Total Cases.
-   Turn left and move east 309 miles to South Dakota with 282895 Total Cases.
-   Turn left and move north 331 miles to North Dakota with 292604 Total Cases.
-   …

##### Evaluation of Turn-By-Turn Directions

-   Spatial knowledge: From landmark knowledge, we have name, and possibly type, but are missing shape, size, and orientation of the features on the map. All the elements of route knowledge are there, including distance, direction, legs of the route, and shape of the route between two locations. There is little to know survey knowledge given. Since we’re only given a small portion of the distance and direction, it may be possible to grasp the distance between two features. States like California that slant would have different distances and directions between bordering states depending on where the user started from and ended on their route. So for practical purposes, no survey knowledge is given.
-   Numeric values: Assuming all features are presented, and it’s possible to switch between values, yes, this interface has numeric values (although doing any analysis with values would be hard).
-   Verdict: Fail.

#### Detailed Text Description

Although this level of text description is rare, let’s try and hit all the elements of spatial knowledge for a few states. For more information on detailed text description, [view the trainings at the UniDescription project (Opens a new tab)](https://unidescription.org/):

Overview: This is a map of COVID cases over Oregon (974,924 Cases), Washington (1,975,382 Cases), and Idaho (525,825 Cases). Oregon, Washington and Idaho are three states with Washington to the north of Oregon. Both Washington and Oregon are sandwiched between the pacific ocean on the west, and Idaho in the east.

-   Washington State is distinguished by its unique geographical shape. Washington has a notable Olympic Peninsula extending around 25 miles into the Pacific Ocean on the northwestern corner and a more rectangular eastern region. The state is oriented with the Pacific to its west, Canada to the north, Idaho to the east, and Oregon to the south. It is the 18th largest state in the U.S. It is 360 miles wide from east to west and 240 miles long. The southern border between Washington and Oregon is primarily defined by the Columbia River, making it fairly straight but with natural deviations due to the river’s course. There is a notable 100 mile wide “hump” or bulge in this border, where Washington’s territory extends southward 15 miles into what would otherwise be a straight line, near the mid-eastern area around Walla Walla. The eastern border with Idaho is largely straight from north to south. The northern border with Canada is a straight line. The western border is the most irregular, defined by the Pacific coastline to the west and the Puget Sound to the northwest. The Olympic Peninsula juts out around 25 miles into the Pacific Ocean in the middle of the western border around 190 miles south of the northern border, creating a varied and rugged coastline. The Puget Sound further indents the state’s western boundary, with numerous inlets and islands creating a complex maritime boundary. Washington state has 1975382 Total Cases.
-   Oregon is characterized by its diverse geographical features. It has the rugged Pacific coastline defining its western edge and the more uniform eastern region bordered by Idaho. The state is situated with the Pacific Ocean to its west, Washington to the north, Idaho to the east, and California and Nevada to the south. It ranks as the 9th largest state in the U.S. Oregon spans about 360 miles from east to west and approximately 260 miles from north to south. The northern border between Washington and Oregon is primarily defined by the Columbia River, making it fairly straight but with natural deviations due to the river’s course. There is a notable 100 mile long “hump” or bulge in this border, where Washington’s territory extends southward around 15 miles into what would otherwise be a straight line, near the mid-eastern area around Walla Walla. The eastern border between Oregon and Idaho is relatively strait with a small hump of Idaho that goes into Oregon around the middle of the border between Nevada and Washington. The southern border is relatively straight, with minor deviations. It is defined by surveyed lines rather than natural features, creating a clear demarcation between Oregon and its southern neighbors, California and Nevada. California extends from the pacific ocean and covers about 60% of the southern border, and Nevada covers the eastern part of the southern border for around 40%. Oregon’s western border is marked by its Pacific coastline, which stretches approximately 363 miles. Unlike the relatively straight borders to the north and south, the western coastline adds a natural and irregular edge to the state’s shape with a slight slant, around 25 miles, into the pacific ocean near the southern edge. Oregon has 974924 Total Cases.
-   Idaho is marked by its distinctive shape and diverse geography. It features a narrow panhandle that stretches northward, flanked by Washington and Montana, and a broader southern section that shares borders with Utah, Nevada, Oregon, and Wyoming. The state is oriented with Canada to its north, Montana and Wyoming to the east, Nevada and Utah to the south, and Oregon and Washington to the west. It ranks as the 14th largest state in the U.S. Idaho spans about 305 miles from north to south and approximately 479 miles from east to west at its widest point. Idaho’s northern border is relatively short, about 40 miles, confined to the narrow panhandle, and is defined by a straight line that separates it from British Columbia, Canada. The eastern border with Montana and Wyoming starts in the north with Montana. For around 100 miles, the border is fairly strait going north to south with a very gentle slope east. A stronger eastern curve into Montana happens, and Idaho eventually has Montana completely to the north for about 150 miles until it reaches Wyoming. The eastern border between Idaho and Wyoming is strait for around 100 miles. The southern border is strait for around 479 miles (its widest point). The southern border is split equally between Utah in the east and Nevada in the west. The eastern border between Oregan and Washington is strait for around 305 miles, and 60% in the south is the border with Oregan and the 40% in the north is with Washington. Idaho has 525825 Total Cases.
-   …

##### Evaluation of Detailed Text Description

-   Spatial knowledge: All elements of landmark knowledge are present for the three given states, including name, type, shape, orientation, and size of the different features. Although the border descriptions could be more detailed, the route around the border is described enough to get basic distance, direction, legs of the route, and shape of the route. Each of the features has a detailed description, and there is a broader description of the features after the end. All elements of distance, direction, shape, size, orientation, and general layout are described. This description has about a 20 mile fidelity error, and the curve in Idaho could be described more accurately. The given map being described has a higher visual resolution, so the description should have higher resolution as well.
-   Numeric values: All the numeric values are present, assuming the user can switch between the desired values, or that there is a longer list of values at the end of each state’s description.
-   Verdict: Pass with caveats. It has about a 20 mile margin of error, so is still not as accurate as most maps with around 60 feet margin of error. So as long as the presented visual map has a 20 mile margin of error, this is WCAG compliant.

#### Interactive Alt-Text

<iframe src="https://www.audiom.net/embed/13?apiKey=b_e0xbMW4_hk9tDtOYMrZ&heading=4" width="100%" height="580" style="border:0" title="U.S. Covid-19 Audiom Map"></iframe>

##### Evaluation of Interactive Alt-Text

-   Spatial Knowledge: All elements of landmark knowledge are present, including name, type, shape, orientation, and size of the different features. By weaving in and out of the borders, the route around the border includes exact distance, direction, legs of the route, and shape of the route. All survey knowledge elements for each point, polygon, and line, including distance, direction, shape, size, orientation, and general layout are accessible. The fidelity is as small as the provided dataset. If there is data that needs to be updated, that can happen in real-time.
-   Numeric values: All numeric values for all features are present.
-   Verdict: Pass!

## Conclusion

Using the framework of landmark, route, and survey knowledge gives a quantitative framework for evaluating equality of digital geographic maps according to [WCAG 1.1.1:Non-text Content (opens a new tab)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content). It’s possible, through detailed text descriptions and interactive alt-text to convey the detailed spatial knowledge present on maps. It is not acceptable to only provide numeric information (e.g., tables), or route information (e.g., through turn-by-turn directions) as an alternative to a digital map. Every alternative map representation needs to convey all elements of landmark, route, and survey knowledge to be WCAG A compliant. The geometries are what make a map a “map” and not a graph or table. If geometries are not fully represented through text, the representation is not serving the equivalent purpose.

It’s strange that universities almost only have degrees in data visualization. Since only text representation is required by law, it should be what’s mostly taught. Data is a-modal and can be presented visually, through audio, through touch, and through text. Educational institutions and map tools rarely facilitate data representation and cartography in non-visual modalities. Despite this, text representation is the only representation needed for websites and apps.

[The 2024 resolution by the National Federation of the Blind calls for digital maps to follow this framework of spatial knowledge (Opens a new tab)](https://nfb.org/resources/speeches-and-reports/resolutions/2024-resolutions#11). The resolution calls for all institutions of higher education and federal agencies to adopt this framework. Although it’s possible to create long-form text descriptions, it takes a long time, is expensive, is difficult to index, and difficult to update. It takes significantly less time and money to create an interactive text map with [Audiom (Opens a new tab)](/). [Please contact us if you want help making a fully WCAG compliant text representation for your map (Opens a new tab).](/contact)

## Terms Used in This Post

-   **Systematic**: Doing something in an organized and planned way, following a specific method or system.
-   **Quantitative**: Related to numbers and amounts. When you measure or count something, you are being quantitative.
-   **Spatial**: Related to space and the position, area, and size of things within it. It’s about where things are located and how they are arranged.
-   **Polygon**: A flat shape with straight sides. Examples include triangles, squares, and pentagons.
-   **Geometry**: A shape of some kind.
-   **Framework**: A basic structure that supports or guides something. It’s like a skeleton that helps hold everything together.
-   **Feature**: A distinctive part or characteristic of something. On a map, a feature could be a mountain, river, or building that stands out and can be identified. It’s any location on a map.

​
