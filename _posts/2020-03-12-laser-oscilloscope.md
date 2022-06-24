---
layout: post
title: "Laser Oscilloscope"
# excerpt: "Using a laser pointer to visualize sound. <br/><img src='/images/oscope-laser.jpg'>"
excerpt: "Using a laser pointer to visualize sound."
# collection: portfolio
date: 2020-03-12
permalink: /laser-oscilloscope/
---

<iframe width="100%" height="400px" src="https://www.youtube-nocookie.com/embed/pAbzJu8eGcs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I had a lot of fun with this project. Inspired by [this video](https://www.youtube.com/watch?v=C-V1uXeyGmg), I was able to construct a sort of analog oscilloscope to visualize sound using only a laser pointer, a BlueTooth speaker, an old yogurt container, and a broken piece of a mirror.

To start, I loaded up [OSC Controller](https://play.google.com/store/apps/details?id=com.ffsmultimedia.osccontroller&gl=US) on an old tablet and set up a custom [PureData](https://puredata.info/) patch to receive the OSC data, then process it into sound. From there, the sound was then sent wirelessly to my BlueTooth controller, which was placed ever so delicately inside the yogurt container, which was then sealed shut.

Finally, I glued a broken shard of a mirror to the top of the container lid and angled my laser pointer right at the mirror fragment, thus reflecting off the mirror and onto the nearest surface of my choosing.

Some other interesting things to note:

<ul>
    <li>
        In the video, you can hear the resonant frequencies of the yogurt container when the "buzzing" is at its strongest. This results in some really cool visuals, where you can see that same resonant intensity reflected in the scale of the laser's motion on the projector screen.
    </li>
    <li>
        In this recording, I was playing back the audio live, controlling the sound parameters from the tablet off-screen.
    </li>
</ul>

While the original patch for this project has sadly been lost to time, here's at least one screenshot from PureData so you can see how it looks. Hope you enjoyed!

<img src="/assets/blog/laser-oscilloscope/pure-data-screenshot.png" alt="A screenshot from the program PureData.">
