---
layout: post
title: "Virtual Tabletop"
categories: misc 
permalink: /virtual-tabletop/
excerpt: "Creating a web-based ASCII grid for use in tabletop RPGs."
---

A few weeks ago I suffered a [Cogmind](https://www.gridsagegames.com/cogmind/)-fueled bout of inspiration to build an ASCII grid for use in tabletop RPGs (such as Dungeons and Dragons, Stars Without Number, and many more), and for no reason in particular, felt like developing it in JavaScript to be as cross-platform friendly as possible. A few late nights later and the **Virtual Tabletop** simulator was born!

<!-- ![A trailer for the virtual tabletop simulator](/assets/blog/virtual-tabletop/vtt-trailer.mp4) -->

<video width="100%" controls>
    <source src="/assets/blog/virtual-tabletop/vtt-trailer.mp4" type="video/mp4">
</video>

There's a lot more I'd like to do with this project, but for the time being I believe it is complete. It hosts a wide range of features designed to facilitate ease of use, including automatic saving of the maps, JSON and raw text import/export options, touchscreen support, and more. The one thing I didn't quite manage was network connectivity to support multiple hosts on the same map instances at the same time -- but as a solo web dev with limited prior experience, I feel that it's already pretty impressive as-is.

If you'd like to check it out for yourself, you can try it [here](/vtt/)!
