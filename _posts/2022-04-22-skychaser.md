---
layout: post
title: "Arcade Flight Sim Proof of Concept"
categories: misc 
permalink: /arcadeflight/
excerpt: "A proof-of-concept build for an upcoming Unity project."
---

Like a lot of people, I really enjoy the crunchy, pixelated look of many retro games. There's something iconic about the look of games made with limited color palettes and severe hardware/resource constraints that makes them very aesthetically pleasing --- so, like many others, I spent some time trying to recreate that look with modern tools. Specifically, I wanted to create an arcade-style flight simulator a la [Star Fox](https://en.wikipedia.org/wiki/Star_Fox_(1993_video_game)) with a more modern take on the retro-style... style.

![Screenshot from Star Fox for the Nintendo 64.](/assets/blog/skychaser/starfox-n64.png)
<p class='caption'>Star Fox (1993) — still an iconic look, if perhaps a bit outdated.</p>

For this project, I was inspired by the game [A Short Hike](https://ashorthike.com/), which has both an adorable art style and fun, simple gameplay that I thought would be a great challenge to replicate (the art style that is -- although I suppose you could call A Short Hike a flight simulator, in a sense!). The game's creator, Adam Robinson-Yu, [gave a talk](https://www.youtube.com/watch?v=ZW8gWgpptI8) at GDC in 2020 where he discussed several aspects of the game's creation, including the art style and rendering tricks used to accomplish it. 

![Screenshot from 'A Short Hike'.](/assets/blog/skychaser/a-short-hike.jpg)
<p class='caption'><a href="https://ashorthike.com/">A Short Hike</a> (2019)</p>

The game's iconic pixelated look is achieved by rendering the output of the main game camera to a downscaled render texture, and then blowing that up without any antialiasing to then fit the target resolution. For my project, I did this in the same way by rendering to a Unity Render Texture, then displayed that on the UI inside a RawImage object. By tweaking the render texture resolution, I was able to achieve a slightly more pixelated look that I felt better suited my overall goal. I then modeled some simple assets and began building the shaders using Unity's built-in URP Shader Graph to create the ocean shader and other shaders in the scene. 

![Screenshot from the Skychaser proof of concept build.](/assets/blog/skychaser/skychaser.png)
<p class='caption'>Screenshot from the proof-of-concept build — still a work in progress!</p>

If you'd like to try it for yourself, you can [here](/skychaser/)! Use W/A/S/D to control the ship, and Q/E to roll. It also works with a gamepad controller.
