// Copyright 2018 Google LLC.
// SPDX-License-Identifier: Apache-2.0

// It can be really helpful to have constants for keycodes
// That way when you look at your source in a 3 months you won't
// have to remember what keycode 37 means :)
const KEYCODE = { // https://keycode.info/
    TAB: 9,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68
};

const KEYS = {
    UP: ["ArrowUp", "W", "w"],
    DOWN: ["ArrowDown", "S", "s"],
    LEFT: ["ArrowLeft", "A", "a"],
    RIGHT: ["ArrowRight", "D", "d"],
    MENU: ["Tab"],
    CONSOLE: ["`", "~"],
    CONFIRM: [" ", "Enter"],
    PRIMARY: ["E", "e"],
    SECONDARY: ["Q", "q"],
    TERTIARY: ["F", "f"],
    ESCAPE: ["Escape"],
    SHIFT: ["Shift"],
    CONTROL: ["Control"],
    ALT: ['Alt'],
    RELOAD: ['R', 'r']
};

const speed = 1; // num. cells to move when moving
const scalar = 3;
var delta = speed; // observed move speed considering multipliers

function get_cell(x, y) {
    return $(`.${x}_${y}`);
}

function set_cell(x, y, content) {
    return get_cell(x, y).text(content);
}

function is_empty(x, y) {
    if (x == 0 || x == (MAX_HEIGHT - 1)) return false;
    if (y == 0 || y == (MAX_WIDTH - 1)) return false;

    for (let i = 0; i < entities.length; i++) {
        if (entities[i].x == x && entities[i].y == y) {
            return false;
        }
    }
    
    /* TODO: check for walls, other obstacles, etc. as they are added */

    return true;
}

var shift_down = false;

const main = document.querySelector("body");
main.addEventListener("keydown", onKeyDown);
main.addEventListener("keyup", onKeyUp);
main.addEventListener("click", onClick);

function onKeyDown(event) {
    // console.log(`Event.key: ${event.key}`)
    if (shift_down) {
        delta = speed * scalar;
    } else {
        delta = speed;
    }

    { // keypress logic
        if (KEYS.MENU.includes(event.key)) {
            event.preventDefault();
            // console.log(`MENU: ${event.key}`);
        } else if (KEYS.UP.includes(event.key)) {
            event.preventDefault();
            // console.log(`UP: ${event.key}`);
            
            for (let ent in entities) {
                entities[ent].move(-delta, 0);
            }
        } else if (KEYS.DOWN.includes(event.key)) {
            event.preventDefault();
            // console.log(`DOWN: ${event.key}`);

            for (let ent in entities.reverse()) {
                entities[ent].move(delta, 0);
            }
    
        } else if (KEYS.LEFT.includes(event.key)) {
            event.preventDefault();
            // console.log(`LEFT: ${event.key}`);
            
            for (let ent in entities) {
                entities[ent].move(0, -delta);
            }

        } else if (KEYS.RIGHT.includes(event.key)) {
            event.preventDefault();
            // console.log(`RIGHT: ${event.key}`);

            for (let ent in entities.reverse()) {
                entities[ent].move(0, delta);
            }
    
        } else if (KEYS.MENU.includes(event.key)) {
            event.preventDefault();
            // console.log(`MENU: ${event.key}`);
        } else if (KEYS.CONSOLE.includes(event.key)) {
            event.preventDefault();
            // console.log(`CONSOLE: ${event.key}`);
        } else if (KEYS.CONFIRM.includes(event.key)) {
            event.preventDefault();
            // console.log(`CONFIRM: ${event.key}`);
        } else if (KEYS.PRIMARY.includes(event.key)) {
            event.preventDefault();
            // console.log(`PRIMARY: ${event.key}`);
        } else if (KEYS.SECONDARY.includes(event.key)) {
            event.preventDefault();
            // console.log(`SECONDARY: ${event.key}`);
        } else if (KEYS.TERTIARY.includes(event.key)) {
            event.preventDefault();
            // console.log(`TERTIARY: ${event.key}`);
        } else if (KEYS.RELOAD.includes(event.key)) {
            event.preventDefault();
            // reload window
            window.location.reload(true);
        } else if (KEYS.ESCAPE.includes(event.key)) {
            event.preventDefault();
            console.debug(`ESCAPE: Clearing Entities...`);
            let ct = entities.length;
            for(let i = 0; i < ct; i++) {
                // kill_entity_at_index(0);
                entities[0].destroy();
            }
            // entities = [];
        } else if (KEYS.SHIFT.includes(event.key)) {
            event.preventDefault();
            shift_down = true;
        }  else if (KEYS.CONTROL.includes(event.key)) {
            event.preventDefault();
        } else if (KEYS.ALT.includes(event.key)) {
            event.preventDefault();
            // console.log(`ALT: ${event.key}`);
        } else {
            console.log(`Unmapped keypress ${event.key}`);
        }
    }
    
}

function onKeyUp(event) {
    if (KEYS.SHIFT.includes(event.key)) {
        event.preventDefault();
        shift_down = false;
    }
}

function onClick(event) {
    var classes = event.target.classList;
    
    // console.log(classes)
    let X_POS = classes[0];
    let Y_POS = classes[1];
    // console.log(event.target.parentElement); // parent of clicked node

    if (X_POS == null || Y_POS == null || isNaN(X_POS) || isNaN(Y_POS)) {
        // ignore click and drag in this function
        // console.warn("Click undefined.")
        return;
    } 
    
    // console.debug(`Clicked X: ${X_POS}, Y: ${Y_POS}`);
    if (classes.value.includes('entity')) {
        // console.log("Error: Entity already exists in this position.");
        // kill_entity_at_index(get_entity_index_for(X_POS, Y_POS));
        // if (classes)
        
        let ent = get_entity_for(X_POS, Y_POS);
        ent.active = !ent.active;

        if (classes.value.includes("focused")) {
            // console.log(event.target)
            event.target.classList.remove("focused");
        } else {
            // console.log(event.target)
            event.target.classList.add("focused");
        }


        
    } else {
        if (is_empty(X_POS, Y_POS)) {
            // console.log("Creating new entity.");
            let ent = new Entity(X_POS, Y_POS, event.target);
        }
    }

}


/* Mouse Drag settings */

var map = document.querySelector("#map");

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

map.addEventListener("touchstart", dragStart, false);
map.addEventListener("touchend", dragEnd, false);
map.addEventListener("touchmove", drag, false);

map.addEventListener("mousedown", dragStart, false);
map.addEventListener("mouseup", dragEnd, false);
map.addEventListener("mousemove", drag, false);

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    // if (e.button == 2) { // if right mouse held down
    if (e.button == 0 || e.button == 2) { // if left OR right mouse held down
        active = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;
}

function drag(e) {
    if (active) {

        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        var classes = e.target.classList;
        
        let x = classes[0]; // x coordinate of currently hovered cell
        let y = classes[1]; // y coordinate


        switch (rightsidebar_active) { // switch based on which tool is active on right sidebar
            case "rsb_walls": // place walls at cursor
                if (!isNaN(x) && !isNaN(y) && is_empty(x, y)) {
                    new Wall(x, y, e.target);
                }
                break;
            case "rsb_player":
                if (!isNaN(x) && !isNaN(y) && is_empty(x, y)) {
                    new Player(x, y, e.target);
                }
                break;
            case "rsb_entity":
                if (!isNaN(x) && !isNaN(y) && is_empty(x, y)) {
                    new Entity(x, y, e.target);
                }
                break;
            case "rsb_erase":
                if (!isNaN(x) && !isNaN(y) && !is_empty(x, y)) {
                    kill_entity_at(x, y);
                }
                break;
            case null: // nothing selected
                break;
            default:
                // something selected, but not specified
                console.warn("Unspecified sidebar button active!");
                break;
        }


    }
}

// function setTranslate(xPos, yPos, el) {
//     el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
// }