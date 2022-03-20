const speed = 1; // num. cells to move when moving
const scalar = 3;
var delta = speed; // observed move speed considering multipliers

var draw_size = 1; // cell paint size option
var shift_down = false;

const dragOverlay = $("#drag-overlay"); // for click-drag-select


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


const main = document.querySelector("body");
main.addEventListener("keydown", onKeyDown);
main.addEventListener("keyup", onKeyUp);
// main.addEventListener("click", onClick);
main.addEventListener("mousedown", onClick);

// map.addEventListener("keydown", onKeyDown);
// map.addEventListener("keyup", onKeyUp);
// map.addEventListener("mousedown", onClick);

// document.querySelector("#map").addEventListener("click", onClick);
// $('#map').children('span').on("click", onClick);

// map.addEventListener("click", onClick);
// map.addEventListener("touchstart", onClick, false);

function draw_by_size(type, x, y, target) {
    x = Number(x);
    y = Number(y);
    // console.log(`x: ${x}, y: ${y}`);
    // console.log(`x+1: ${x+1}, y+1: ${y + 1}`);
    // console.log(`x-1: ${x-1}, y-1: ${y - 1}`);
    switch (draw_size) { // draw size is in range [1, 3], inclusive.
        case 3: // NE/SE/NW/SW
            try { new type(x + 1, y + 1, target) } catch {}
            try { new type(x + 1, y - 1, target) } catch {}
            try { new type(x - 1, y + 1, target) } catch {}
            try { new type(x - 1, y - 1, target) } catch {}
        case 2: // N/E/S/W
            try { new type(x + 1, y, target) } catch {}
            try { new type(x - 1, y, target) } catch {}
            try { new type(x, y + 1, target) } catch {}
            try { new type(x, y - 1, target) } catch {}
        case 1: // center
            try { new type(x, y, target) } catch {}
            break;
        default:
            console.warn("Invalid draw size specified: " + draw_size);
            break;
    }
}

function erase_by_size(x, y) {
    x = Number(x);
    y = Number(y);

    switch (draw_size) { // draw size is in range [1, 3], inclusive.
        case 3: // NE/SE/NW/SW
            try { kill_entity_at(x + 1, y + 1) } catch {}
            try { kill_entity_at(x + 1, y - 1) } catch {}
            try { kill_entity_at(x - 1, y + 1) } catch {}
            try { kill_entity_at(x - 1, y - 1) } catch {}
        case 2: // N/E/S/W
            try { kill_entity_at(x + 1, y) } catch {}
            try { kill_entity_at(x - 1, y) } catch {}
            try { kill_entity_at(x, y + 1) } catch {}
            try { kill_entity_at(x, y - 1) } catch {}
        case 1: // center
            try { kill_entity_at(x, y) } catch {}
            break;
        default:
            console.warn("Invalid draw size specified: " + draw_size);
            break;
    }
}

function switch_rsb(x, y, e) { // x pos, y pos, click event
    // console.log('called switch_rsb');

    if (isNaN(x) || isNaN(y)) {
        return; // fail if x, y coords are NaN
    }


    switch (rightsidebar_active) { // switch based on which tool is active on right sidebar
        case "rsb_walls": // place walls at cursor
            // new Wall(x, y, e.target);
            draw_by_size(Wall, x, y, e.target);
            break;
        case "rsb_player":
            // new Player(x, y, e.target);
            draw_by_size(Player, x, y, e.target);
            break;
        case "rsb_entity":
            // new Entity(x, y, e.target);
            // draw_by_size(Entity, x, y, e.target);
            draw_by_size(Wanderer, x, y);
            break;
        case "rsb_erase":
            // if (!is_empty(x, y)) {
            //     kill_entity_at(x, y);
            // }
            erase_by_size(x, y);
            break;
        case null: // nothing selected
            break;
        default:
            // something selected, but not specified
            console.warn("Unspecified sidebar button active!");
            break;
    }
}


function onKeyDown(event) {
    // console.log(`Event.key: ${event.key}`)
    if (faq_open) { // close faq or IO menu if open
        if (KEYS.CONFIRM.includes(event.key)) { // if menu is open and 
            event.preventDefault(); // enter/space pressed, close menu
            toggle_faq();
        } else if (KEYS.ESCAPE.includes(event.key)) { // if menu is open and
            event.preventDefault(); // esc pressed, close menu
            toggle_faq();
        }
        return;
    } else if (io_open) {
        if (KEYS.ESCAPE.includes(event.key)) { // if menu is open and esc pressed,
            event.preventDefault(); // close menu
            toggle_io();
        }
        return;
    } // else: (if no menu is open)

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

            if (faq_open) { // close faq or IO menu if open
                toggle_faq();
                return;
            } else if (io_open) {
                toggle_io();
                return;
            } // else:



        } else if (KEYS.CONSOLE.includes(event.key)) {
            event.preventDefault();
            // console.log(`CONSOLE: ${event.key}`);
        } else if (KEYS.CONFIRM.includes(event.key)) {
            event.preventDefault();
            // console.log(`CONFIRM: ${event.key}`);

            // if (faq_open) { // close faq or IO menu if open
            //     toggle_faq();
            //     return;
            // } else if (io_open) {
            //     toggle_io();
            //     return;
            // } // else:

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

            if (faq_open) { // close faq or IO menu if open
                toggle_faq();
                return;
            } else if (io_open) {
                toggle_io();
                return;
            } // else:

            if (confirm("would you like to clear all entities?")) {
                console.debug(`ESCAPE: Clearing Entities...`);
                let ct = entities.length;
                for(let i = 0; i < ct; i++) {
                    // kill_entity_at_index(0);
                    entities[0].destroy();
                }
                // entities = [];
            }
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
    // console.log("Click!")
    var classes = event.target.classList;

    if (event.button === 1) return false;  // ignore middle clicks

    if (event.type === "touchstart") {
        // console.log(event.touches)
        // initialX = e.touches[0].clientX - xOffset;
        // initialY = e.touches[0].clientY - yOffset;

        // active = true;
        // console.log(event.target);
    }
    
    
    // console.log(classes);

    let X_POS = classes[0];
    let Y_POS = classes[1];
    // console.log(event.target.parentElement); // parent of clicked node

    if (X_POS == null || Y_POS == null || isNaN(X_POS) || isNaN(Y_POS)) {
        // ignore click and drag in this function
        // console.warn("Click undefined.")
        return;
    } 
    
    // console.debug(`Clicked X: ${X_POS}, Y: ${Y_POS}`);
    if (classes.value.includes('entity') && !classes.value.includes('wall') && rightsidebar_active != "rsb_erase") {
        // console.log("Error: Entity already exists in this position.");
        // kill_entity_at_index(get_entity_index_for(X_POS, Y_POS));
        // if (classes)
        
        // let ent = get_entity_for(X_POS, Y_POS);
        // ent.toggle_focus();

        if (shift_down) {
            // toggle focus and ignore other elements
            let ent = get_entity_for(X_POS, Y_POS);
            ent.toggle_focus();
        } else {
            // make ent the ONLY focused element
            let ent = get_entity_for(X_POS, Y_POS);
            ent.toggle_focus();

            for (let i in entities) {
                if (!entities[i].equals(ent))
                    entities[i].unfocus();
            }
        }
        
    } else {
        if (is_empty(X_POS, Y_POS) || rightsidebar_active === "rsb_erase") { // if pos is empty or eraser selected
            switch_rsb(X_POS, Y_POS, event); // place entity based on what tool is selected
        }
    }

}

/* Mouse Drag settings */

// var map = document.querySelector("#map");

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;
// var scaling = false; // pinch scaling
var overlay_initial_x; var overlay_initial_y;
var overlay_current_x; var overlay_current_y;

map.addEventListener("touchstart", dragStart, false);
map.addEventListener("touchend", dragEnd, false);
map.addEventListener("touchmove", drag, false);

map.addEventListener("mousedown", dragStart, false);
map.addEventListener("mouseup", dragEnd, false);
map.addEventListener("mousemove", drag, false);


var on_target = null; // under mouse when click pressed
var off_target = null; // was under mouse when click released
function dragged() {
    if (on_target != null && off_target != null) {
        // console.log(on_target);
        let on_row = Number(on_target.getAttribute('data-x'));
        let on_col = Number(on_target.getAttribute('data-y'));

        // console.log(off_target);
        let off_row = Number(off_target.getAttribute('data-x'));
        let off_col = Number(off_target.getAttribute('data-y'));

        for (let j = Math.min(off_col, on_col); j < Math.max(off_col, on_col); j ++) {
            for (let i = Math.min(off_row, on_row); i < Math.max(off_row, on_row); i ++) {
                console.log(`cell: ${i}, ${j}`);
                new Wall(i, j);
            }   
        }
    }
}


function dragStart(e) {
    if (e.type === "touchstart") {
        // console.log(e.touches)
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;

        active = true;        
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    // if (e.button == 2) { // if right mouse held down
    if (e.button === 0 || e.button === 2) { // if left OR right mouse held down
        active = true;
    }

    if (!(rightsidebar_active != null) && active) {
        /* rightsidebar has no tool; do click-drag select */
        console.log('activating overlay');

        overlay_initial_x = e.pageX;
        overlay_initial_y = e.pageY;

        // console.log(e.target);
        on_target = e.target;

        $("#drag-overlay").css( {
            display: "block",
            top: e.pageY, 
            left: e.pageX, 
            bottom: e.pageY, 
            right: e.pageX
        });
    }
}

function dragEnd(e) { 
    // if (scaling) {
    //     pinchMove(e);
    // } else {
    initialX = currentX;
    initialY = currentY;

    active = false;

    // redraw map and all entities in case some were updated but not visually changed
    if (rightsidebar_active == "rsb_erase") {
        redraw();
    }
    // }

    if (!(rightsidebar_active != null)) { // if no item selected
        // console.log('disabling overlay');

        $("#drag-overlay").css({
            display: 'none',
            width: 0,
            height: 0,
        }); // hide overlay
        
        // TODO: select objects in area, etc
        off_target = e.target;

        dragged(); // trigger actions in dragged area
    }
}

function drag(e) {
    if (active) {
        if (e.type === "touchmove" && e.touches.length === 2) {
            /* if this is a touch pinch event, do nothing (allow default behavior) */
        } else {
            e.preventDefault();
            
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = Math.floor(currentX / CHARSIZE.y);
            yOffset = Math.floor(currentY / CHARSIZE.x);

            var classes = e.target.classList;
            // console.log(e.target.classList);
            
            let x = classes[0]; // x coordinate of currently hovered cell
            let y = classes[1]; // y coordinate

            if (rightsidebar_active != null) {
                switch_rsb(x, y, e); // perform click action based on which tool is selected
                // switch_rsb(currentX, currentY, e);
                // switch_rsb(xOffset, yOffset, e);
            } else {
                /* if no tool is selected, draw a div overlay */
                overlay_current_x = e.pageX;
                overlay_current_y = e.pageY;
                
                if (overlay_current_x >= overlay_initial_x) {
                    // mouse is to the right of start pos
                    $('#drag-overlay').css("width", (e.pageX - overlay_initial_x));
                } else {
                    // mouse is to the left of start pos
                    $('#drag-overlay').css("width", -(e.pageX - overlay_initial_x));
                    $('#drag-overlay').css("left", e.pageX);
                }

                if (overlay_current_y >= overlay_initial_y) {
                    // mouse is below start pos
                    $('#drag-overlay').css("height", (e.pageY - overlay_initial_y));
                } else {
                    // mouse is above start pos
                    $('#drag-overlay').css("height", -(e.pageY - overlay_initial_y));
                    $('#drag-overlay').css("top", e.pageY);
                }



                // $("#drag-overlay").css( {
                //     // bottom: e.pageY, 
                //     // right: e.pageX
                //     // bottom: Math.abs(overlay_initial_x - e.pageX), 
                //     // right: Math.abs(overlay_initial_y - e.pageY)
                //     // width: Math.abs(overlay_initial_x - e.pageX), 
                //     // height: Math.abs(overlay_initial_y - e.pageY)
                //     width: (e.pageX - overlay_initial_x), 
                //     height: (e.pageY - overlay_initial_y)
                // });
            }
        } // end if not pinch event
    }
}