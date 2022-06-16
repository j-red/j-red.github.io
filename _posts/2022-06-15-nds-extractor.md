---
layout: post
title: "Nintendo DS Model Extraction"
categories: misc 3D
permalink: /nds-extractor/
excerpt: "Extracting 3D models and their respective textures from Nintendo DS game files."
---

<h3>Table of Contents </h3>
* TOC
{:toc}

<!-- Summary -->
<!-- Wrote a script to extend the functionality of apicula, a popular Nintendo DS ROM-hacking tool, in converting and importing the models into Blender. -->

## Overview  

Let's say, hypothetically, you're like me and grew up playing iconic games such as [Animal Crossing: Wild World](https://animalcrossing.fandom.com/wiki/Animal_Crossing:_Wild_World) (2005) or [Dragon Quest IX](https://dragonquest.fandom.com/wiki/Dragon_Quest_IX) (2009) on the Nintendo DS. 
And, if you're (hypothetically) like me, you developed an interest in programming, 3D modeling, and what are now considered "retro" games along the way. 
And somehow, all this culminated into a strange desire to rip 3D models from old games while writing tools to make it easier in the future. 
Well, that's pretty much what I've done.  

## Process

* Legally obtain a ROM (.nds) file for a Nintendo DS game
* Dump the 3D models with the `apicula` ([GitHub](https://github.com/scurest/apicula)) command line utility into a folder
* From the directory with both apicula and the .NDS file, run:
  * `apicula extract <ROM.NDS> -o <OUTPUT DIRECTORY>`
  * On Windows, you need to have the Command Prompt or PowerShell window in the same directory as the .exe, or to add it to your PATH (which seems a bit overkill, in my opinion).
* This could be automated entirely in Blender using os module… and then packaged as an addon? 
* Apicula is under the 0BSD license (a Free Public License with no liabilities or restrictions)
* Once the files are dumped, attempt to parse all of them as .dae files with 
  * `apicula convert <TARGET DIR>/* <MODEL OUTPUT DIR>`

## Tool development

During this process, I also wrote several smaller scripts to help facilitate the organization/viewport performance across different scenes. As the ROM that I used had nearly 6000 models (each with their own materials, textures, and rigging information!), it was important that the viewport be performant.

### NDS Importer

* To bring the `DAE` files into Blender, target this new output dir in the Blender importer script and run! Change the configuration settings for textures, etc., as you see fit
* The script does several things, including:
  * Imports the model and renames it according to the apicula file that was extracted (important for organization instead of having hundreds of `Armature.001`s clogging up the scene)
  * Automatically links the input texture alpha to the materials in the viewport
  * Automatically enables transparency with Alpha Clip for both opaque and transparent surfaces
  * Automatically sets the texture interpolation to any of Blender's available options (I chose "Closest", meaning no interpolation, as the other options would make the pixel art less crisp.)
* My script was tested on the game DragonQuest IX, a popular game that I remember fondly from my childhood.

### Regular Expression Selection

* I also found that (at least for this game), practically every model had several copies and different skins, so there was a lot of repeated content that I didn't feel would be useful or helpful to keep around. Additionally, some versions of the LOD meshes were improperly skinned/fixed by Blender's tris-to-quads algorithm, but as there were multiple copies, I could just delete these to not worry about them and use the properly skinned versions instead.
* One thing I noticed was the lower-quality level-of-detail ("LOD") mesh objects always matched the higher quality version, with the addition of "_f" at the end of the name. As Blender doesn't have a way to select by name like this (that I know of!), I decided to write a simple tool to let me do that as well.
	* Edit: I found the option to do so in Blender using the Select -> Select Pattern menu. While I'm thrilled to know this is here (and shows you learn something new about Blender every day!), I had fun writing my own addon extension for it and appreciated the practice in using Blender's class system for registering and unregistering modules, as well as executing code through the UI panels.
* I wanted a way to select objects and armatures using regular-expression style notation, which would (for example) allow me to select and isolate all the LOD meshes matching the pattern "*_f"
* Calling it "re-select", for "regular expression select"
  * Of course, while I was trying to figure out where to put the menu for the addon, I was looking in the built-in Blender "Select" menu and found the 'Select Pattern' tool, which does basically exactly what the tool I just made does, if not better. Oh well. It was still a good learning experience.

### Redistributor

* One thing that I DIDN'T find a built-in tool for was neatly arranging large quantities of models/objects in a scene. So, I wrote something to fix that too.  
* I also wrote scripts to organize and redistribute the armatures in the scene -- deleting several copies, moving them between scenes, etc., often resulted in chaotic arrangements of the armatures. So, I used Python to once again extend the Blender backend to automatically rearrange the characters/models/rigs into a grid arrangement for easier access.
* Would be nice to utilize a grid packing algorithm to consolidate them as much as possible, or check the sizing information/dimensions of each object first to pack according to model size.

![A monster's idle animation with IK bones sticking out](/assets/blog/nds-extractor/demon-ik.gif)
		
## My Findings  

* A surprising number of particle effects, etc., have their own rigged objects which are animated using UV map displacement; this is different from modern games (e.g., Unity in my experience), which use particle systems and complex shaders/node graphs to achieve the same effects. Cool to see similar styles achieved with much more severe hardware constraints.

![.GIF of moving the rigging bones in a particle effect object](/assets/blog/nds-extractor/particle-rig.gif)

* Facial features and other characteristics reused across skins are often separate and use a separate material (e.g., slime eyes), which is really clever and neat.
* I still didn't find the player models or any* (I found one) NPCs, which is really what I was looking for. Sad.

![Screenshot of the character Aquila from Dragon Quest IX](/assets/blog/nds-extractor/aquila.png)

## Conclusion  
<!-- <h2 style="display: inline;"> -->
<!-- Conclusion -->
<img src="/assets/blog/nds-extractor/small-goblin.gif" width="150px" alt="An animation of a goblin bouncing back and forth" style="margin-top: -120px; margin-left: 80%; margin-bottom: -60px;" />  
<!-- </h2> -->

<!-- ![An animation of a goblin bouncing back and forth.](/assets/blog/nds-extractor/small-goblin.gif) -->

I learned a lot from this project.

### Source Code

My utility scripts including the [**NDS Importer**](https://github.com/j-red/blender-addons/tree/main/nds-importer/) and [**Object Redistributor**](https://github.com/j-red/blender-addons/tree/main/redistributor) are available on [GitHub](https://github.com/j-red/blender-addons/).

### Disclaimer  

I do not endorse any illegal activity regarding ROM hacking or the abuse of copyright law or intellectual property. Only use this tool for files you own and have the right to use!  


## Testing on [Legend of Zelda: Phantom Hourglass](https://zelda.fandom.com/wiki/The_Legend_of_Zelda:_Phantom_Hourglass) (2007)

* Move the `.NDS` file to the same directory as the `apicula` executable
* Run `apicula extract zelda.nds -o loz` to extract the game data
* Run `apicula convert loz/* -o loz_out/` to convert the game files into 3D meshes that Blender can read
  * This returned the output, `Got 1119 models, 3518 textures, 3509 palettes, 3527 animations, 1808 pattern animations, 132 material animations.`
  * After some time, it concluded with `Wrote 1119 DAEs, 1953 PNGs.`
* Then, open Blender and load the `nds-importer.py` script. Change the parameters to point to the `loz_out/` directory. Change the number to import at a time and run!
* The UVs aren't perfect, but the meshes and textures appear to be intact. 
  * Not bad for a game nearly of drinking age! (In Canada/Europe, at least)
