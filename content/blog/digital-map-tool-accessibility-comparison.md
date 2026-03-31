---
title: "Digital Map Tool Accessibility Comparison"
date: 2024-08-12
lastmod: 2025-05-21
slug: "digital-map-tool-accessibility-comparison"
draft: false
---

Understanding the accessibility of digital map tools is essential for creating inclusive and accessible maps on your app or website. This is a systematic comparison of the accessibility of top digital map tools. This post is a partial summary of the journal article titled: [Systematically Evaluating Digital Map Tools Based on the WCAG (Opens a new Tab).](http://hdl.handle.net/20.500.12680/qn59qf178) The evaluation is based on [the 14 criteria outlined in this report (Opens a new tab).](https://github.com/Malvoz/web-maps-wcag-evaluation/blob/master/README.md) These criteria were taken from the [Web Accessibility Guidelines (WCAG) (Opens a new tab).](https://www.w3.org/TR/WCAG21/) [The WCAG is used to evaluate compliance for many digital accessibility laws around the world (Opens a new tab).](https://www.w3.org/WAI/policies/) The 14 criteria are a partial list of all the guidelines. They are elements that the authors of the report thought were particularly applicable to digital maps. Note that most governments only require WCAG AA compliance, and only 12/14 criteria are WCAG AA.

## Comparison Table

![Bar chart showing Audiom with 100% compliance followed by Bing Maps Embed with 57% compliance and MapBox Studio embed with 50% compliance. For more information view the second column in the below table.](/images/Untitled.jpg)

[Download the table from Google Sheets (Opens a new tab)](https://docs.google.com/spreadsheets/d/1D3IfrSR1aKuUUiFq5TCfGnuQ4tLR75Y5q2Ai38OTHCQ/edit?usp=sharing)

Web map tool

Total

Level A

Level AA

Level AAA

% Accessibility Attainment

Failed

Applicable

Failed

Applicable

Failed

Applicable

Failed

Applicable

**Audiom**

**100.00%**

**0**

**14**

**0**

**9**

**0**

**3**

**0**

**2**

Bing Maps embed

57.00%

6

14

3

9

1

3

2

2

MapBox Studio embed

50.00%

7

14

4

9

1

3

2

2

Concept 3D

50.00%

7

14

4

9

1

3

2

2

Leaflet JS API

46.00%

7

13

3

8

3

3

1

2

Bing Maps Control API

38.00%

8

13

4

8

2

3

2

2

MapBox GL JS API

38.00%

8

13

4

8

2

3

2

2

OpenStreetMap embed

36.00%

9

14

4

9

3

3

2

2

OpenLayers API

31.00%

9

13

5

8

2

3

2

2

ESRI

29.00%

10

14

5

9

3

3

2

2

MapKit JS (Apple Maps) API

25.00%

9

12

5

7

2

3

2

2

TomTom Maps SDK for Web

23.00%

10

13

6

8

3

3

1

2

Google Maps Platform API

15.00%

11

13

7

8

2

3

2

2

Google Maps embed

8.00%

12

13

7

8

3

3

2

2

### Sources

[Audiom Accessibility Conformance Report (Opens a new tab)  
](https://xrnavigation.io/acr)[Concept 3D Accessibility Conformance Report (Opens a new tab)  
](https://resources.concept3d.com/vpat-request)[WCAG Map Tool Comparison (Opens a new tab)  
](https://github.com/Malvoz/web-maps-wcag-evaluation/blob/master/README.md)[ESRI Accessibility Conformance Report (Opens a new tab)](https://www.esri.com/content/dam/esrisites/en-us/media/legal/vpats/map-viewer-march-2022-vpat.pdf)

## Comparison Criteria

The following criteria were used in this comparison:

-   [1.1.1 Non-text Content (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#non-text-content)
-   [1.3.1 Info and Relationships (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#info-and-relationships)
-   [1.4.3 Contrast (Minimum) (Level AA) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#contrast-minimum)
-   [2.1.1 Keyboard (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#keyboard)
-   [2.1.2 No Keyboard Trap (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#no-keyboard-trap)
-   [2.1.4 Character Key Shortcuts (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#character-key-shortcuts)
-   [2.4.3 Focus Order (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#focus-order)
-   [2.4.7 Focus Visible (Level AA) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#focus-visible)
-   [2.5.5 Target Size (Level AAA) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#target-size)
-   [3.1.1 Language of Page (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#language-of-page)
-   [3.1.2 Language of Parts (Level AA) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#language-of-parts)
-   [3.2.2 On Input (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#on-input)
-   [3.2.5 Change on Request (Level AAA) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#change-on-request)
-   [4.1.2 Name, Role, Value (Level A) (Opens a new tab)](https://www.w3.org/TR/WCAG21/#name-role-value)

## Notes and Considerations

Some of the data was taken from the Accessibility Conformance Report provided on a vendor’s website. Other data was taken from [this independent accessibility evaluation done on top map tools (Opens a new tab).](https://github.com/Malvoz/web-maps-wcag-evaluation/blob/master/README.md) If the vendor report said “partially Complies” that was a fail. [A criteria needs to be “pass” for it to be considered passing (Opens a new tab).](/five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat/)

Also, WCAG section 1.1.1:Non-text content was not evaluated correctly on most reports. [As discussed in this blog post, many interpretations of this criteria are flawed (Opens a new tab).](/how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples/) This criteria should use landmark, route, and survey knowledge elements for systematic evaluation. As of this writing, only [Audiom (Opens a new tab)](/) has been evaluated with this system to my knowledge.

[Please contact us if you have updates to this report, or if you want to discuss what map tool would be best for your project (Opens a new tab).](/contact)
