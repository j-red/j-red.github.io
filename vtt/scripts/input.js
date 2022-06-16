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
    RELOAD: ['R', 'r'],
    DELETE: ['Backspace', 'Delete']
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

var last_keypress = new Date();
function onKeyDown(event) {
    let time_since_last_keypress = new Date() - last_keypress;
    // console.log(time_since_last_keypress);
    if (time_since_last_keypress < 50) {
        // console.debug('Preventing repeated keypresses.');
        return;
    }
    last_keypress = new Date();

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
    } else if (settings_open) {
        if (KEYS.ESCAPE.includes(event.key)) { // if menu is open and esc pressed,
            event.preventDefault(); // close menu
            toggle_settings();
        }
        return;
    } else if (welcome_open) {
        if (KEYS.ESCAPE.includes(event.key)) { // if menu is open and esc pressed,
            event.preventDefault(); // close menu
            toggle_welcome();
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

            toggle_fullscreen();

        } else if (KEYS.UP.includes(event.key)) {
            event.preventDefault();
            // console.log(`UP: ${event.key}`);
            
            // for (let ent in entities) {
            //     // entities[ent].move(-delta, 0);
            //     new Promise(() => {entities[ent].move(-delta, 0)});
            // }

            // entities.map(x => x.move(-delta, 0));
            focused_entities.map(x => x.move(-delta, 0));
        } else if (KEYS.DOWN.includes(event.key)) {
            event.preventDefault();
            // console.log(`DOWN: ${event.key}`);

            // for (let ent in entities.reverse()) {
            //     entities[ent].move(delta, 0);
            // }
            focused_entities.map(x => x.move(delta, 0));
    
        } else if (KEYS.LEFT.includes(event.key)) {
            event.preventDefault();
            // console.log(`LEFT: ${event.key}`);
            
            // for (let ent in entities) {
            //     entities[ent].move(0, -delta);
            // }
            focused_entities.map(x => x.move(0, -delta));

        } else if (KEYS.RIGHT.includes(event.key)) {
            event.preventDefault();
            // console.log(`RIGHT: ${event.key}`);

            // for (let ent in entities.reverse()) {
            //     entities[ent].move(0, delta);
            // }
            
            focused_entities.map(x => x.move(0, delta));
            // let results = await Promise.all(tasks);
            // console.log(results);
    
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
            // event.preventDefault();

            // toggle_fullscreen();

            // if (faq_open) { // close faq or IO menu if open
            //     toggle_faq();
            //     return;
            // } else if (io_open) {
            //     toggle_io();
            //     return;
            // } else if (settings_open) {
            //     toggle_settings();
            //     return;
            // } else if (welcome_open) {
            //     toggle_welcome();
            //     return;
            // } // else:
        } else if (KEYS.SHIFT.includes(event.key)) {
            event.preventDefault();
            shift_down = true;
        } else if (KEYS.CONTROL.includes(event.key)) {
            event.preventDefault();
        } else if (KEYS.ALT.includes(event.key)) {
            event.preventDefault();
            // console.log(`ALT: ${event.key}`);
        } else if (KEYS.DELETE.includes(event.key)) {
            event.preventDefault();
            // console.log(`DELETE: ${event.key}`);
            if (focused_entities.length == 0 && confirm("would you like to clear all entities?")) {
                kill_all_entities();
            } else {
                let focused_ents = [];
                for (let i in focused_entities) {
                    focused_ents.push(focused_entities[i]);
                }
                for (let i in focused_ents) {
                    focused_ents[i].destroy();
                }
            }
        } else {
            console.log(`Unmapped keypress ${event.key}`);
        }
    }
    
}

function onKeyUp(event) {
    if (KEYS.SHIFT.includes(event.key)) {
        event.preventDefault();
        shift_down = false;
    } else if (KEYS.ESCAPE.includes(event.key)) {
        // event.preventDefault();

        // toggle_fullscreen();
    }
}

function onClick(event) {
    if (event.button === 1) return false; // ignore middle clicks
    
    let xcoord;
    let ycoord;

    if (event.type === "touchstart") {
        // console.log(event.touches)
        xcoord = event.touches[0].clientX;
        ycoord = event.touches[0].clientY;
    } else {
        xcoord = event.clientX;
        ycoord = event.clientY;
    }

    let ele = document.elementFromPoint(xcoord, ycoord);
    let X_POS = ele.getAttribute('data-x');
    let Y_POS = ele.getAttribute('data-y');
    
    // console.log(event.target.parentElement); // parent of clicked node

    if (X_POS == null || Y_POS == null || isNaN(X_POS) || isNaN(Y_POS)) {
        // ignore click and drag in this function
        // console.warn("Click undefined.")
        return;
    } 
    
    console.debug(`Clicked X: ${X_POS}, Y: ${Y_POS}`);
    var ent = get_entity_for(X_POS, Y_POS);
    // console.log(ent);

    if (ent != null && ent.canFocus && rightsidebar_active != "rsb_erase") {
        // console.log("Error: Entity already exists in this position.");
        // kill_entity_at_index(get_entity_index_for(X_POS, Y_POS));
        // if (classes)
        
        // let ent = get_entity_for(X_POS, Y_POS);
        // ent.toggle_focus();

        if (shift_down) {
            // toggle focus and ignore other elements
            // let ent = get_entity_for(X_POS, Y_POS);
            // ent.toggle_focus();
        } else {
            // make ent the ONLY focused element
            for (let i in entities) {
                if (!entities[i].equals(ent)) {
                    entities[i].unfocus();
                }
            }

            // ent = get_entity_for(X_POS, Y_POS);
        }
        
        // if (!call_dragged) {
        ent.toggle_focus();
        // }
        
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
var call_dragged = false; // whether dragged() should be called on click release
function dragged() {
    if (on_target != null && off_target != null) {
        // console.log(on_target);
        let on_row = on_target.getAttribute('data-x');
        let on_col = on_target.getAttribute('data-y');

        // console.log(off_target);
        let off_row = off_target.getAttribute('data-x');
        let off_col = off_target.getAttribute('data-y');

        if (isNaN(off_row) || isNaN(off_col) || isNaN(on_row) || isNaN(on_col) || on_row == null || on_col == null || off_row == null || off_col == null) {
            console.warn("NaN found in drag select region");
            return;
        }

        // console.log(`${on_row} ${on_col} to ${off_row} ${off_col}`)

        if (!shift_down) {
            // clear focus from all entities 
            for (let i in entities) {
                entities[i].unfocus();
            }
        }

        for (let i = Math.min(off_row, on_row); i < Math.max(off_row, on_row); i ++) {
            for (let j = Math.min(off_col, on_col); j < Math.max(off_col, on_col); j ++) {
                // console.log(`cell: ${i}, ${j}`);

                // do action on cell i, j
                // try {new Wall(i, j)} catch {};
                let e = get_entity_for(i, j);
                if (e != null) {
                    e.focus();
                }
            }   
        }
    }
}


function dragStart(e) {
    console.debug('drag start');
    if (e.type === "touchstart") {
        // e.stopPropagation();
    // if (e.type === "touchmove") {
        // console.log(e.touches)
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;

        active = true; 
    } else {
        // if (e.button == 2) { // if right mouse held down
        if (e.button === 0 || e.button === 2) { // if left OR right mouse held down
            initialX = e.clientX;
            initialY = e.clientY;
            active = true;
        }
    }


    // if (!(rightsidebar_active != null) && active) {
        /* rightsidebar has no tool; do click-drag select */
        // overlay_initial_x = e.pageX;
        // overlay_initial_y = e.pageY;
    try {
        on_target = document.elementFromPoint(initialX, initialY);
    } catch {
        on_target = null;
    }

    call_dragged = false;
    // }
}

function dragEnd(e) {
    console.debug('drag end');
    // if (scaling) {
    //     pinchMove(e);
    // } else {
    initialX = currentX;
    initialY = currentY;

    // active = false;

    // redraw map and all entities in case some were updated but not visually changed
    if (rightsidebar_active == "rsb_erase") {
        redraw();
    }
    // }

    if (!(rightsidebar_active != null) && active) { // if no item selected
        // console.log('disabling overlay');

        $("#drag-overlay").css({
            display: 'none',
            width: 0,
            height: 0,
        }); // hide overlay
        

        // off_target = e.target;
        try {
            off_target = document.elementFromPoint(currentX, currentY);
        } catch {
            off_target = null;
        }

        if (call_dragged) {
            dragged(); // trigger actions in dragged area
            call_dragged = false;
        }
    }

    active = false;
    
    on_target = null;
    off_target = null;

    save_state();
}

function drag(e) {
    if (active) {
        console.debug('drag move (active)');
        call_dragged = true;

        if (e.type === "touchmove" && e.touches.length === 2) {
            /* if this is a touch pinch event, do nothing (allow default behavior) */
        } else {
            e.preventDefault();

            $("#drag-overlay").css( {
                display: "block",
                top: initialY, 
                left: initialX, 
                bottom: initialY, 
                right: initialX
            });

            
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
                // console.log(e)
            } else {
                currentX = e.clientX;
                currentY = e.clientY;
            }

            // xOffset = Math.floor(currentX / CHARSIZE.y);
            // yOffset = Math.floor(currentY / CHARSIZE.x);

            let ele = document.elementFromPoint(currentX, currentY);
            let x;
            let y;
            
            try {
                x = ele.getAttribute('data-x');
                y = ele.getAttribute('data-y');
            } catch {
                // console.error('Invalid drag region.');
                x = null;
                y = null;
            }

            if (rightsidebar_active != null) {
                switch_rsb(x, y, e); // perform click action based on which tool is selected
                // switch_rsb(currentX, currentY, e);
                // switch_rsb(xOffset, yOffset, e);
            } else {
                /* if no tool is selected, draw a div overlay */
                
                if (currentX >= initialX) {
                    // mouse is to the right of start pos
                    $('#drag-overlay').css("width", (currentX - initialX));
                } else {
                     // mouse is to the left of start pos
                    $('#drag-overlay').css("width", -(currentX - initialX));
                    $('#drag-overlay').css("left", currentX);
                }

                if (currentY >= initialY) {
                    // mouse is below start pos
                    $('#drag-overlay').css("height", (currentY - initialY));
                } else {
                    // mouse is above start pos
                    $('#drag-overlay').css("height", -(currentY - initialY));
                    $('#drag-overlay').css("top", currentY);
                }
            } // end if rsb_active is null
        } // end if not pinch event
    } // end if active
} // end drag function