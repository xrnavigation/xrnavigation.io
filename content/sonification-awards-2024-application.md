---
title: "Sonification Awards 2024 Application"
date: 2024-12-31
lastmod: 2024-12-31
slug: "sonification-awards-2024-application"
type: "audiom-embed"
audiom_id: 38
draft: false
---

# Sonification Awards 2024 Application

If you’re new to Audiom, please [complete this interactive Audiom tutorial first, then return to this page (Opens in a new tab)](https://www.audiom.net/embed/38?apiKey=b_e0xbMW4_hk9tDtOYMrZ&demo=true). Activate the “Enable sounds and skip to map” button, and use the arrow keys or buttons to move. [Please give us any feedback you have! (Opens in a new tab).](https://docs.google.com/forms/d/e/1FAIpQLScyfjmDemBAZnxpyTll71OnZL-ngrh6n7W3Zj5dMi-i8O0OAw/viewform?usp=pp_url&entry.461268424=https://www.audiom.net/&entry.901768009=brandonkeithbiggs@gmail.com)

## Sonification

<iframe src="https://www.audiom.net/embed/70?apiKey=b_e0xbMW4_hk9tDtOYMrZ&soundpack=indoor" width="100%" height="700" style="border: 0"></iframe>

## Head Author Resume

[Brandon Biggs CV (Opens a new tab)](https://docs.google.com/document/d/1TzoFFaUSf95JZ_HFdK_uR9qWnkmVdnVZ/edit?usp=sharing&ouid=110752876328664437220&rtpof=true&sd=true)

## How the Submission Meets the Criteria

### 1\. It must convey useful information to its intended user.

The tasks this sonification facilitates include:

1.  **Selecting a venue**: Before the totally blind conference planning team selected a venue, they were given inaccessible PDF maps of the different places they were interested in. These PDFs were inaccessible, which left the team with selecting the venue based on the provided description of the space. With this map (with all booths removed), they were able to understand how the space was laid out, the distance between the exhibit hall and restrooms, and how traffic would flow through the space.
2.  **Approving the layout of the booths**: The totally blind conference planning team received an inaccessible PDF map of the exhibit hall layout from their conference planning partner and were asked to approve it. Without this map, they were unable to view the PDF map in any way. With this map, they were able to explore the layout of booths, how they related to the entry stairs, where the workshop stages were, etc. The team was also able to understand how traffic would flow between booths, restrooms, stages, and the entrance.
3.  **Selecting a booth**: Before exhibitor names were placed on the booths, the booths just had the booth number. Totally blind exhibitors were able to accessibly select an empty booth at their desired location. The exhibitors could select a booth near their partners or complementary companies, choose if they wanted to be closer to the door or on a corner, and get oriented to the space before arriving at the venue.
4.  **Exhibitor directory**: This map can serve as an exhibitor directory for attendees. If users select “Object Menu” and filter by “Tables,” they will easily be able to arrow or swipe through all the booths in the space. If they go to a booth and press “space,” they will be able to read the description of the exhibitor, if it exists.
5.  **Orientation and Planning**: Attendees can explore the layout of the space before arriving at the location, learn how the space is laid out, build a mental map, and plan the route to visit their desired exhibitors. They can also learn where the restroom is and where the presentation areas are. Without this information, attendees would be “blindly” walking into the space with no idea of where things are or who’s around.

### 2\. It is easy to understand by its intended audience.

-   The interface conventions are based on Audio Games, which are games that can be played completely using audio and are often built by and for blind users ([Biggs, Yusim, & Coppin, 2018](#ref-biggsyusimcoppin2018audiogame)). For example:
    1.  **Key commands**: Visual interfaces focus on WASD for movement and/or using the mouse, but Audio Games primarily use the arrow keys for movement. F2 is frequently used as a commands list in Audio Games. Actions have a letter related to the name of the action (e.g., “m” for menu or “h” for help).
    2.  **Verbosity modes**: There are two verbosity modes, first-person mode, and grid-mode. First-person mode only announces features when the user enters or exits them. For example, “entering exhibit hall” or “exiting exhibit hall.” Grid mode, the default mode, announces all features at a location, along with coordinates in the space. In our research, we have found an even split between those who prefer each mode ([Biggs, Coughlan, & Coppin, 2019](#ref-BiggsCoughlanCoppin2019design)). First-person mode can be accessed with “f,” while grid mode can be accessed with “g.”
-   Auditory icons are reminiscent of the object textures, which makes them easier to identify. The exhibit hall has the sound of footsteps on a wooden carpeted surface, bleachers have metal footsteps, doors have a clicking latch, bathrooms have a tile footstep, etc.  
    
-   Spatial audio is also employed as an optional tool for finding landmarks in the space. For example, on this map, the bathrooms, stairs to the entrance, and presentation areas all have looping spatial sounds that can be toggled on and off by pressing “p” (as in “play” and “pause”).  
    
-   Since the non-visual map experience is often new for users, we have built an interactive tutorial at: [Interactive Map Demo (Opens a new tab)](https://xrnavigation.io/audiom-demo) that is presented when the map is opened.  
    
-   The system is self-voicing for sighted users by default, but if the user selects the “Toggle screen reader/TTS” action, or presses “backslash” (\\), then their own personal screen reader will be used to read all text.

### 3\. Its data-to-sound mapping strategy is grounded in relevant scientific research.

-   All features have a relevant auditory icon that is reminiscent of the object: Using the research from Gaver ([1986](#ref-Gaver1986)), Dingler, Lindsay, & Walker ([2008](#ref-dingler2008learnabiltiy)), and Brazil & Fernstrom ([2011](#ref-BrazilFernstrom2011A)), every feature has a short iconic sound that is reminiscent of the sound a white cane (or a hard-soled shoe) makes when it hits an object. This makes the sounds easy to recognize without hearing speech, faster than hearing speech, and makes the interface more realistic. For example, the exhibit hall has a hard carpeted floor to represent the actual surface that was there. The bleachers have metal footstep sounds to represent a cane actually hitting the metal of the bleachers. The stairs have the sound of feet clacking on stairs. The wall sound has a firm “click” sound to represent a collision with something that is not passable (although the user can go through walls in this version of the map). Doors also have no step sound, but instead have the clicking of a door handle being turned. This is much more gentle than the wall collision sound and sounds like a door being opened.
-   **Spatial audio to designate important landmarks**: Using the research by Walkera & Wilsonc ([2021](#ref-walkera2021swan)), Heuten, Henze, & Boll ([2007](#ref-heuten2007interactive)), and Bruce N. Walker & Lindsay ([2006](#ref-walker2006navigation)), we use looping sounds in spatial audio to designate important landmarks. Users can hear the looping auditory icon that’s reminiscent of the landmark and either rotate and/or move their avatar to the sound. There are three categories of landmarks that have looping sounds: restrooms, stairs, and the workshop stages. Only some objects were provided looping sounds to emphasize these important landmarks and reduce cognitive load.
-   **Interactive game interfaces are effective at conveying spatial information**: This auditory interface is a keyboard auditory map, where users move a character around the virtual environment to learn the space. The efficacy of this sonification interface type can be found in numerous publications, including: Balan, Moldoveanu, & Moldoveanu ([2015](#ref-BalanMoldoveanuMoldoveanu2015)), Connors, Chrastil, Sánchez, & Merabet ([2014](#ref-connors2014virtual)), Picinali, Afonso, Denis, & Katz ([2014](#ref-picinali2014exploration)), Feng, Stockman, Bryan-Kinns, & Al-Thani ([2015](#ref-feng2015investigation)), and Biggs, Toth, Stockman, Coughlan, & Walker ([2022](#ref-biggsTothStockmanCoughlanWalker2022Evaluation)). Other kinds of sonification map interfaces (e.g., touchscreens) have also been evaluated, but Delogu et al. ([2010](#ref-delogu2010non)) found no significant difference between the touchscreen and keyboard sonification interfaces at communicating spatial information. The data mapping approach for spatial information for all these sonified map interfaces uses a collision detection algorithm that looks at the user avatar’s coordinates and determines what objects intersect with their position. This provides a list of objects that are then announced and have their sounds played.
-   **Directions use an auditory beacon**: When the user opens the object menu, selects an object that is a distance away, selects “Directions” from the submenu, and presses “r,” an auditory beacon plays in spatial audio directing the user to the object. Using the research by Bruce N. Walker & Lindsay ([2006](#ref-walker2006navigation)) and May, Sobel, Wilson, & Walker ([2019](#ref-may2019auditory)), we play the beacon in spatial audio with a max distance set, so the user is always able to hear the beacon. As they get closer to the object, the auditory beacon begins to pulse faster. Additionally, the pitch of the beacon gets lower the farther away the user is. When the user gets within ten steps of the destination, the beacon gets louder and closer to the center. This triple emphasis of parameter mappings (volume, rhythm, and pitch) increases their usability ([Krygier, 1994](#ref-Krygier1994); [B. N. Walker & Nees, 2011](#ref-WalkerNees2011)).

### 4\. It follows an explicit design methodology.

This sonification interface is based on previous research, audio games, co-designs, and evaluations.

-   **Previous research**: Using the aforementioned research on auditory icons, the keyboard map sonification interface, etc., past work plays a strong role in the methodology used in this interface.
-   **Audio Games**: Additionally, audio games were used as a major inspiration as well. Audio games are commercially available interfaces that were built by and for blind people. These factors suggest that the solutions presented in this space are just as effective (if not more effective) than those done by the academic community ([Biggs et al., 2018](#ref-biggsyusimcoppin2018audiogame)).
-   **Co-Design**: Co-design, where target users are brought in to be designers in the interface, were performed. These co-designs are outlined in Biggs et al. ([2024](#ref-Biggs2024CovidCoDesign)), Biggs et al. ([2019](#ref-BiggsCoughlanCoppin2019design)), and Biggs ([2019](#ref-biggs2019MRP)). Two separate co-designs were held where users first learned what a map was, were asked to design their ideal pre-trip planning solution or data analytics tool, then presented with a prototype interface, and asked how the interface could become their ideal solution.
-   **Evaluation**: Blind participants were used to evaluate different aspects of this sonification interface. They were asked to answer questions about their understanding of the spatial information (e.g., what features border another feature), follow paths, find objects, and locate object density ([Biggs et al., 2019](#ref-BiggsCoughlanCoppin2019design); [Biggs, Toth, et al., 2022](#ref-biggsTothStockmanCoughlanWalker2022Evaluation)).

### 5\. It is successful in supporting the intended users in achieving their goals.

Both the sonification interface and this exhibit hall map have been evaluated for efficacy:

-   **Sonification Interface**:
    1.  Both Biggs et al. ([2019](#ref-BiggsCoughlanCoppin2019design)) and Biggs, Toth, et al. ([2022](#ref-biggsTothStockmanCoughlanWalker2022Evaluation)) systematically evaluate the interface at conveying spatial information. They found that the interface does effectively communicate distance, direction, shape, size, orientation, and general layout of all points, polygons, and lines.
    2.  Level Access, a digital accessibility evaluation company, completed an Accessibility Conformance Report showing the interface meets the Web Content Accessibility Guidelines AAA compliance ([XR Navigation, n.d.](#ref-AudiomACR)). This report is required for governments to legally use the interface ([Information Technology Industry Council, n.d.](#ref-VPAT)).
-   **This exact representation**:
    1.  A recent unpublished study was performed on 14 blind and 10 sighted participants, where they had to redraw a simplified version of this floor plan with only 10-12 (at least 2 points, 2 polygons, and 2 lines) using wiki sticks and raised line graph paper. Sighted participants used both a visual map and the audio map, while the blind participants just used the audio map. There was no significant difference with sighted participants when redrawing the floor plan in either the audio-only or visual-only conditions (P<0.05). The blind participants were significantly worse than the sighted participants, although the blind participants were still around 85% accurate (P<0.05). This is probably due to the fact blind participants view less than one map a year, in contrast to sighted participants who view more than 300 maps a year ([Biggs, Pitcher-Cooper, & Coughlan, 2022](#ref-biggs2022TMAPs); [Savino et al., 2021](#ref-savino2021maprecorder)).
    2.  Two blind participants used this map to perform different tasks during the VRATE 2024 conference: 1) Describe and verify the location of a particular booth; and 2) physically navigate to two locations after viewing the map without asking for assistance. Both of these tasks were completed with 100% accuracy, which suggests that the aforementioned tasks should be easy to perform with this map. All of the participants rated their experience with the map a 10 out of 10.
    3.  Over 1000 blind people viewed the map during the VRATE 2024 conference. Although no other success metrics were collected, there were no support requests or complaints about the interface.
    4.  The blind conference planning team members were interviewed about their experience having an accessible map for the first time. The feedback was that the experience was a 10 out of 10, and the team was definitely going to continue using the map for future conferences.

### 6\. It must pay attention to the quality and appropriateness of the sonic experience.

1.  **Quality of sounds**: All sounds were professionally recorded, created to represent the texture or actual sound of the object in the real world, and be faster to hear than listening to speech.
2.  **Design Choices**:
    1.  **User Interface sounds**: An earcon was created to signal menus opening and closing. The opening sound is a rapid ascending arpeggio of a chord, and the menu closing sound is the same arpeggio reversed and descending.
    2.  **The short auditory icons were built for speed**: The short sounds are meant to speed up map exploration. For example, if the user desires to go ten steps and use speech to hear the object name, it takes around ten seconds listening at 500 words a minute (the average speed of a screen reader user), in contrast with two seconds if only the short auditory icons play.
    3.  **The looping ambient auditory icons represent important landmarks**: The looping ambient sounds that play when the user presses “p” are meant to represent important landmarks in the space. The restrooms, stairs, and workshop stages all have a looping sound associated with them. The sounds are meant to gently alert the user of what’s around without using speech. The stairs are the entrance and exit to the exhibit hall. The restroom is the only room outside of the exhibit hall users will really want to know about, and the workshop stages are at the most northern ends of the outer booth columns and are difficult to find without a sound.

### Criteria

1.  **Interactive Solution**: This sonification can be used for numerous tasks, from location review, traffic planning, and orientation, which all require slightly different kinds of information. Because this interface allows the user to “pull” their desired information from the interface, they don’t need to review all the available data. This map has over 120 features, and each feature can convey all aspects of spatial knowledge, including its name, description, short sound, looping sound, distance from other features, direction from other features, the route needed to go to any other feature, shape, size, orientation, and how it relates to the general layout of all the other features. All this information for over 120 features is too much information for accomplishing the aforementioned tasks. Additionally, listening to someone else use the interface does not quickly convey the directionality of the avatar movement. Personal exploration is key to this sonification, as a map is meant to help learn information that the user didn’t know existed.
2.  **It is accessible to users regardless of their cultural background**: It is always difficult to create something that is truly devoid of cultural context, but the auditory icons are meant to represent a hard object colliding with the material of the object, which should be fairly universal. Other sounds, such as the dripping water to represent a restroom, are more Western-centric, but they are what the restrooms sound like in the space, so should be understandable across cultures. Although this interface is only presented in English, users can hear the English words using their own screen reader synthesizer, which is often set to another language for English as a second language users.
3.  **It is accessible to blind or visually impaired users**: This is the primary inspiration for building this sonification. The development and sound design team for this sonification are blind, past evaluations were done on mostly blind participants, the conference organizing committee were blind, and most of the attendees of the conference were blind. Before having access to this sonification, the blind conference organizing committee were unable to preview the space or approve the booth layout before physically going to the space. It is expensive and difficult to obtain a tactile graphic of this kind of map, and with over 120 features, this map would be a small book of tactile maps. With this representation, all the organizing committee were able to review the space at the same time and provide informed feedback on the space and booth layout. Blind exhibitors were able to independently select their desired booth for the first time. Blind attendees were able to understand the layout of the space and plan their route to visit their desired exhibitors without leaving the exhibit hall experience up to chance. Currently, for blind attendees, exhibit halls are loud, chaotic spaces with an unknown layout, unknown exhibitors, and no information about what’s around. A blind attendee normally selects a random direction and walks until they reach a booth and just moves from that booth along whatever row they are on. If they need to use the restroom, they need to find someone who knows where it is. Using this sonification, the stress and anxiety of orienting to this complex space is reduced, and independent and autonomous navigation is actually possible.

## References

Balan, O., Moldoveanu, A., & Moldoveanu, F. (2015). Navigational audio games: An effective approach toward improving spatial contextual learning for blind people. _International Journal on Disability and Human Development_, _14_(2), 109–118. [https://doi.org/10.1515/ijdhd-2014-0018](https://doi.org/10.1515/ijdhd-2014-0018)

Biggs, B. (2019). _Designing accessible nonvisual maps_ (Master’s thesis). OCAD University. Retrieved from [http://openresearch.ocadu.ca/id/eprint/2606](http://openresearch.ocadu.ca/id/eprint/2606)

Biggs, B., Agbaroji, H., Toth, C., Stockman, T., Coughlan, J. M., & Walker, B. N. (2024). Co-designing auditory navigation solutions for traveling as a blind individual during the COVID-19 pandemic. _Journal of Blindness Innovation and Research_, _14_(1). Retrieved from [https://nfb.org/images/nfb/publications/jbir/jbir24/jbir140102.html](https://nfb.org/images/nfb/publications/jbir/jbir24/jbir140102.html)

Biggs, B., Coughlan, J., & Coppin, P. (2019). Design and evaluation of an audio game-inspired auditory map interface. Retrieved from [https://icad2019.icad.org/wp-content/uploads/2019/06/ICAD\_2019\_paper\_51.pdf](https://icad2019.icad.org/wp-content/uploads/2019/06/ICAD_2019_paper_51.pdf)

Biggs, B., Pitcher-Cooper, C., & Coughlan, J. (2022). Getting in touch with tactile map automated production: Evaluating impact and areas for improvement. _Journal on Technology and Persons with Disabilities_, _10_. Retrieved from [https://scholarworks.csun.edu/handle/10211.3/223471](https://scholarworks.csun.edu/handle/10211.3/223471)

Biggs, B., Toth, C., Stockman, T., Coughlan, J. M., & Walker, B. (2022). Evaluation of a non-visual auditory choropleth and travel map viewer. In _International conference on auditory display_. International Conference on Auditory Display. Retrieved from [https://icad2022.icad.org/wp-content/uploads/2022/06/ICAD2022\_27.pdf](https://icad2022.icad.org/wp-content/uploads/2022/06/ICAD2022_27.pdf)

Biggs, B., Yusim, L., & Coppin, P. (2018). The audio game laboratory: Building maps from games. Retrieved from [http://icad2018.icad.org/wp-content/uploads/2018/06/ICAD2018\_paper\_51.pdf](http://icad2018.icad.org/wp-content/uploads/2018/06/ICAD2018_paper_51.pdf)

Brazil, E., & Fernstrom, M. (2011). Chapter 13 auditory icons. In T. Hermann, A. Hunt, & J. G. Neuhoff (Eds.), _The sonification handbook_. Berlin, Germany: Logos Publishing House. Retrieved from [http://sonification.de/handbook/download/TheSonificationHandbook-chapter13.pdf](http://sonification.de/handbook/download/TheSonificationHandbook-chapter13.pdf)

Connors, E. C., Chrastil, E. R., Sánchez, J., & Merabet, L. B. (2014). Virtual environments for the transfer of navigation skills in the blind: A comparison of directed instruction vs. Video game based learning approaches. _Frontiers in Human Neuroscience_, _8_, 223. Retrieved from [https://www.frontiersin.org/articles/10.3389/fnhum.2014.00223/full](https://www.frontiersin.org/articles/10.3389/fnhum.2014.00223/full)

Delogu, F., Palmiero, M., Federici, S., Plaisant, C., Zhao, H., & Belardinelli, O. (2010). Non-visual exploration of geographic maps: Does sonification help? _Disability and Rehabilitation: Assistive Technology_, _5_(3), 164–174. Retrieved from [https://www.tandfonline.com/doi/full/10.3109/17483100903100277](https://www.tandfonline.com/doi/full/10.3109/17483100903100277)

Dingler, T., Lindsay, J., & Walker, B. N. (2008). Learnabiltiy of sound cues for environmental features: Auditory icons, earcons, spearcons, and speech. In. International Community for Auditory Display.

Feng, F., Stockman, T., Bryan-Kinns, N., & Al-Thani, D. (2015). An investigation into the comprehension of map information presented in audio. In _Proceedings of the XVI International Conference on Human Computer Interaction_ (p. 29). ACM.

Gaver, W. (1986). Auditory icons: Using sound in computer interfaces. _Human-Computer Interaction_, _2_(2), 167–177. [https://doi.org/10.1207/s15327051hci0202\_3](https://doi.org/10.1207/s15327051hci0202_3)

Heuten, W., Henze, N., & Boll, S. (2007). Interactive exploration of city maps with auditory torches. In _CHI’07 extended abstracts on human factors in computing systems_ (pp. 1959–1964). ACM.

Information Technology Industry Council. (n.d.). VPAT. Retrieved from [https://www.itic.org/policy/accessibility/vpat](https://www.itic.org/policy/accessibility/vpat)

Krygier, J. B. (1994). Sound and geographic visualization. In _Modern cartography series_ (pp. 149–166). Academic Press: 2. Retrieved from [https://makingmaps.net/2008/03/25/making-maps-with-sound/](https://makingmaps.net/2008/03/25/making-maps-with-sound/)

May, K. R., Sobel, B., Wilson, J., & Walker, B. N. (2019). Auditory displays to facilitate object targeting in 3d space. In _Proceedings of the 2019 international conference on auditory display_ (Vol. 8, pp. 155–162). Retrieved from [https://icad2019.icad.org/wp-content/uploads/2019/06/ICAD\_2019\_paper\_8.pdf](https://icad2019.icad.org/wp-content/uploads/2019/06/ICAD_2019_paper_8.pdf)

Picinali, L., Afonso, A., Denis, M., & Katz, B. F. (2014). Exploration of architectural spaces by blind people using auditory virtual reality for the construction of spatial knowledge. _International Journal of Human-Computer Studies_, _72_(4), 393–407.

Savino, G.-L., Sturdee, M., Rundé, S., Lohmeier, C., Hecht, B., Prandi, C., … Schöning, J. (2021). MapRecorder: Analysing real-world usage of mobile map applications. _Behaviour & Information Technology_, _40_(7), 646–662. Retrieved from [https://www.tandfonline.com/doi/full/10.1080/0144929X.2020.1714733#d1e806](https://www.tandfonline.com/doi/full/10.1080/0144929X.2020.1714733#d1e806)

Walker, Bruce N., & Lindsay, J. (2006). Navigation performance with a virtual auditory display: Effects of beacon sound, capture radius, and practice. _Human Factors_, _48_(2), 265–278.

Walker, B. N., & Nees, M. A. (2011). Chapter 2: Theory of sonification. In T. Hermann, A. Hunt, & J. G. Neuhoff (Eds.), _The sonification handbook_. Berlin, Germany: Logos Publishing House. Retrieved from [http://sonification.de/handbook/download/TheSonificationHandbook-chapter2.pdf](http://sonification.de/handbook/download/TheSonificationHandbook-chapter2.pdf)

Walkera, B. N., & Wilsonc, J. (2021). SWAN 2.0: Research and development on a new system for wearable audio navigation. In _Proceedings of the WirelessRERC state of the technology forum_. Retrieved from [https://wirelessrerc.gatech.edu/sites/default/files/publications/walker\_swan2-wirelessrerc-sot2021-proceedings-v16-withalttext.pdf](https://wirelessrerc.gatech.edu/sites/default/files/publications/walker_swan2-wirelessrerc-sot2021-proceedings-v16-withalttext.pdf)

XR Navigation. (n.d.). Accessibility conformance reports. Retrieved from [https://xrnavigation.io/acr/](https://xrnavigation.io/acr/)
