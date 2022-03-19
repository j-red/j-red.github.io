## TODO: 
* Add `focus` element for selected entity
* Only control focused entity with directional movement, etc
* Make borders/window adjust to size of screen
* Enable change of zoom (fixed for a given map; control by GM)
* Enable save/load of Entities, NPCs, maps, etc. Do so in browser cookies? Or JSON exports for ease of sharing.
* Toggle focus by **clicking on individual Entities to toggle**, or by **clicking and dragging around a group to select all and deselect all others**. (Hold shift to add to existing selection in both cases?)

* Add extra layer of invisible <span> grid that can be used for temporary overlay effects
* Add 3rd layer on top for UI overlays?
* Reverse entity move direction loop for down and right movement --> this doesn't work; when entities that are adjacent move in the same direction, a space is still added between them

* Add tool select option for right click drag; select from (default) doing nothing, painting walls, erasing them, placing entities, deleting entities, etc., from a popup bar in menu or something
* Create 'Container' entities that store a list of entities inside them
* Create an 'Item' base class for other items to derive from
* add 'virtual table top' logo/copyright in bottom right
    * Fix margin to right; make fixed distance
* Add Tutorial/FAQ menu; onboard new users appropriately

* Add -/+ size option for painting tools; place below buttons on RHS (done)
* Map exporter (export as JSON string? add export/import menu in bottom right)
* Enable export JSON entities list to import/save into another map
* also allow export as text for safekeeping

* Button mouse hover styling for bottom right buttons and buttons in IO menu

### TO FIX:
* Erasing entities does not remove only the ones dragged over -- presumably the erase call is made multiple times on the same index before the one is removed? (DONE)

#### Long-term:
* Right click context menu for each entity; create popup with name, health, other stats
* Journal menu on left side of screen; press Tab to open
* Console at bottom of screen; use to run commands, select entities, issue orders, tweak settings, etc.
* Chat window in bottom right
* Network connectivity (one host, others can connect to)
* Add attacks, actions, enemies, turn-based ordering
* Item pickups, stats
* Let players choose own character icons instead of `@`
* Line of sight/fog of war; raycasting