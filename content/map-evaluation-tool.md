---
title: "Map Evaluation Tool"
date: 2024-02-19
lastmod: 2025-12-11
slug: "map-evaluation-tool"
draft: false
---

<style>
/* Page-specific heading color override to match WP */
.entry-content > h2,
.entry-content > h3 {
  color: var(--ast-global-color-1) !important;
}
</style>

<div class="wp-block-uagb-container alignfull uagb-is-root-container map-eval-hero" style="background-image: url('/images/map-eval-hero.webp'); background-size: cover; background-position: 62% 12%; background-repeat: no-repeat; padding: 100px 10px;">
<div class="uagb-container-inner-blocks-wrap" style="max-width: 70%; margin: 0 auto;">
<div class="wp-block-uagb-container" style="padding: 10px;">
<div class="wp-block-uagb-advanced-heading" style="text-align: center;">
<h1 class="uagb-heading-text" style="color: rgb(249, 250, 251); margin-bottom: 0;">Introduction</h1>
</div>
<div class="wp-block-buttons is-content-justification-center is-layout-flex" style="justify-content: center; display: flex; margin: 20px 0;">
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="https://docs.google.com/document/d/1f005gPHJ7TmgFK0rLQ0K_zfkRg2U-6AZ//export?format=docx" style="background-color: var(--ast-global-color-4); color: var(--ast-global-color-0); padding: 15px 20px; border-radius: 4px; text-decoration: none; font-family: var(--font-heading); font-size: 16px;">Download this map evaluation tool as a word file</a></div>
</div>
<p class="has-text-align-center has-ast-global-color-4-color has-text-color" style="text-align: center; color: rgb(249, 250, 251);">This is a tool to help you quickly evaluate your web map for some of the most common accessibility issues. This is not a comprehensive evaluation or a <a href="https://www.itic.org/policy/accessibility/vpat" style="color: rgb(249, 250, 251);">Voluntary Product Accessibility Template</a> (VPAT), but a way to find some of the <a href="https://github.com/Malvoz/web-maps-wcag-evaluation/blob/master/README.md" style="color: rgb(249, 250, 251);">most common issues present in maps</a>. This is based on the <a href="https://www.w3.org/TR/WCAG21/" style="color: rgb(249, 250, 251);">Web Content Accessibility Guidelines</a> (WCAG). If issues are found as part of this evaluation, it can help make the case for a more accessible solution, such as <a href="/" style="color: rgb(249, 250, 251);">Audiom from XR Navigation</a>. This evaluation is based on <a href="https://github.com/Malvoz/web-maps-wcag-evaluation/blob/master/README.md" style="color: rgb(249, 250, 251);">this map evaluation framework</a>.</p>
</div>
</div>
</div>

<div class="wp-block-spacer" style="height: 120px;" aria-hidden="true"></div>

## Knowledge and Tools Needed

1.  You need to understand the basics of HTML and how there are h1, div, button, and other tags with attributes like aria-labeled or disabled.
2.  To check the attributes for an element, select it and right-click. The element should open and show the tags and attributes that are there.
3.  It would be useful to use a screen reader for some testing, such as text content (1.1.1). Here is a guide for using [Voice Over on Mac](https://webaim.org/articles/voiceover/) and [Non Visual Desktop Access (NVDA) on Windows](https://webaim.org/articles/nvda/).
4.  Consider using an automated tool such as [axe](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) that can catch accessibility errors. Running an accessibility scan can help with many of the following issues, such as contrast requirements, but bear in mind that at most, only 70% of accessibility errors can be caught by automated tooling.
5.  To utilize axe, install the extension through the [Chrome web store](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) and restart your browser. Navigate to the page to test, open up the dev tools and navigate to the axe DevTools tab. Press ‘Scan My Page’ to find a list of accessibility issues. Do this before going through the below criteria, as those results will help highlight many of the issues below.

## Evaluation

## [**1.1.1 Non-text Content (Level A)**](https://www.w3.org/TR/WCAG21/#non-text-content)

### **Assessment**

1.  Identify all [non-text content](https://www.w3.org/TR/WCAG21/#dfn-non-text-content).
2.  If non-text content is [pure decoration](https://www.w3.org/TR/WCAG21/#dfn-pure-decoration), is used only for visual formatting, or is not presented to users, then it is implemented in a way that it can be ignored by assistive technology (AT), (e.g. using aria-hidden=”true”).
3.  If the _non-text content_ is not intended as _pure decoration_, it has a [text alternative](https://www.w3.org/TR/WCAG21/#dfn-text-alternative).
4.  If _non-text content_ is a control or input, refer to the assessment of SC 4.1.2 Name, Role, Value for additional requirements.

### Look for The Following

1.  Do logos have alt-text in the “alt” attribute?
2.  Do icons, like “open map in new window”, zoom in, zoom out, close, copyright, etc. have text labels or an “alt” attribute with text?
3.  Are decorative images or text hidden from screen readers with aria-hidden?
4.  [Complete this template to compare the information that is being communicated on the visual map with the information being communicated on the text map (Opens a new tab)](https://docs.google.com/spreadsheets/d/1led7iIbWMd_6RaMkZYqd27zelX1H18YIlqYR40OkSis/edit?gid=1492498835#gid=1492498835). In short, the shape, size, orientation, topological relationships, distance, and direction needs to be available on the text map for every object on the visual map. [According to the paper that presented this Map Equivalent-Purpose Framework (Opens a new tab)](https://arxiv.org/abs/2512.05310), [Audiom Maps (Opens a new tab)](/), Multi User Domain Maps, and [audio description maps (Opens a new tab)](/how-to-make-detailed-map-text-descriptions/) have passed the framework.

## [**1.3.1 Info and Relationships (Level A)**](https://www.w3.org/TR/WCAG21/#info-and-relationships)

### **Assessment**

1.  Verify that information (such as a control’s [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state)), [structure](https://www.w3.org/TR/WCAG21/#dfn-structure), and [relationships](https://www.w3.org/TR/WCAG21/#dfn-relationships) conveyed through [presentation](https://www.w3.org/TR/WCAG21/#dfn-presentation) can be [programmatically determined](https://www.w3.org/TR/WCAG21/#dfn-programmatically-determinable) or are available in text.

### Look for The Following

1.  Is there a [“disabled”](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) attribute on the buttons that can be disabled e.g., zoom, or reset orientation?
2.  Is there an [aria-pressed](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed) attribute on the buttons that can be activated or deactivated e.g., locate me, and full screen?
3.  Is the map wrapped in a labeled [region landmark](https://w3c.github.io/aria/#region) so screen readers and other assistive technology know what is in that area?
4.  Are the Scale bars/rulers understandable non-visually, or are they hidden from the screen reader?

## [**1.4.3 Contrast (Minimum) (Level AA)**](https://www.w3.org/TR/WCAG21/#contrast-minimum)

### Assessment

1.  Verify that the visual presentation of [text](https://www.w3.org/TR/WCAG21/#dfn-text) and [images of text](https://www.w3.org/TR/WCAG21/#dfn-images-of-text) has a [contrast ratio](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio) of at least 4.5:1, except for the following:
    1.  Large Text: [Large-scale](https://www.w3.org/TR/WCAG21/#dfn-large-scale) text and images of large-scale text have a contrast ratio of at least 3:1;
    2.  Incidental: Text or images of text that are part of an inactive [user interface component](https://www.w3.org/TR/WCAG21/#dfn-user-interface-components), that are [pure decoration](https://www.w3.org/TR/WCAG21/#dfn-pure-decoration), that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement;
    3.  Logotypes: Text that is part of a logo or brand name has no contrast requirement.

### Look for The Following

1.  Do buttons and links that control the map meet color contrast requirements?
2.  Do important map labels within the map meet color contrast requirements?

## [**2.1.1 Keyboard (Level A)**](https://www.w3.org/TR/WCAG21/#keyboard)

### **Assessment**

1.  Identify all functionality of the web map.
2.  Ensure all functionality can be accessed using only a keyboard.

### Look for The Following

-   Is the map display pannable using the keyboard?
-   Are map controls and information possible to access without using hover with the mouse?
-   Can drag and drop controls be operated via the keyboard?

## [**2.4.7 Focus Visible (Level AA)**](https://www.w3.org/TR/WCAG21/#focus-visible)

### Assessment

1.  Sequentially navigate components using the tab key (and operate all controls).
2.  Check that script is not used to remove focus and that each component is highlighted.

### Look for The Following

1.  Does every control have a visible focus outline, so when you tab to it, you can easily tell what is being focused?
2.  Do the focus outlines meet the upcoming requirements for [focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-minimum.html) with both contrast and enclosing the focused element?

## [**2.5.5 Target Size (Level AAA)**](https://www.w3.org/TR/WCAG21/#target-size)

### Assessment

1.  Identify [targets](https://www.w3.org/TR/WCAG21/#dfn-target) for [pointer inputs](https://www.w3.org/TR/WCAG21/#dfn-pointer-inputs);
2.  Verify that the size of each target is at least 44 by 44 [CSS pixels](https://www.w3.org/TR/WCAG21/#dfn-css-pixels) except when:
    1.  Equivalent: The target is available through an equivalent link or control on the same page that is at least 44 by 44 CSS pixels;
    2.  Inline: The target is in a sentence or block of text;
    3.  User Agent Control: The size of the target is determined by the user agent and is not modified by the author;
    4.  Essential: A particular presentation of the target is essential to the information being conveyed.

(Note: If you’re a web map tool author wanting to conform to this SC, [Lighthouse will flag targets that are smaller than 48 by 48](https://web.dev/tap-targets/) in CSS pixels as inappropriately sized.)

### Look for The Following

1.  Is each target that meets the above criteria a minimum of 44 by 44 CSS pixels? Consider using [this bookmarklet](https://codepen.io/jared_w_smith/full/vYGXeMy) or [axe](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) in order to measure the target size.

## [**3.1.2 Language of Parts (Level AA)**](https://www.w3.org/TR/WCAG21/#language-of-parts)

### Assessment

1.  Check if the lang attribute is set, and the specified language code matches the language of the content (which may change due to language negotiation, based on system settings).

### Look for The Following

1.  Is the correct [lang attribute](https://www.tpgi.com/using-the-html-lang-attribute/) set for all content, including labels and controls? When you change the map language, is the lang attribute updated on all buttons and controls?
2.  If the map is an embedded iFrame, does the iFrame have the correct lang attribute?

## [**4.1.2 Name, Role, Value (Level A)**](https://www.w3.org/TR/WCAG21/#name-role-value)

### Assessment

For all [user interface components](https://www.w3.org/TR/WCAG21/#dfn-user-interface-components):

1.  The [name](https://www.w3.org/TR/WCAG21/#dfn-name) and [role](https://www.w3.org/TR/WCAG21/#dfn-role) can be [programmatically determined](https://www.w3.org/TR/WCAG21/#dfn-programmatically-determinable);
    1.  States, properties, and values that can be set by the user can be [programmatically set](https://www.w3.org/TR/WCAG21/#dfn-programmatically-set);
2.  and notification of changes to these items is available to user agents, including assistive technologies.

### Look for The Following

1.  Does the map itself have an accessible name? If the map is in an iFrame, is the title attribute set? Are the different areas of the map in a [labeled region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/region_role)?
    1.  Do sub controls, especially those using icons instead of visible labels, have an accessible name through either text in the HTML element or an aria-labeled attribute?
        1.  Are all interactive elements using the proper HTML element or role, ie.g., buttons?
