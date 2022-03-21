function right_sidebar(id) {
    // console.log(`Button ${id} pressed`);
    if ($(`#` + id).hasClass('focused')) {
        // remove focus
        $(`#` + id).removeClass('focused');

        // ensure no element is treated as active
        rightsidebar_active = null;
    } else {
        // remove focus from siblings
        $(`#` + id).siblings('.focused').removeClass('focused');

        // add focus to self
        $(`#` + id).addClass('focused'); 

        // update global active element 
        rightsidebar_active = id;
    }
}


function drawsize(delta) {
    const mindraw = 1;
    const maxdraw = 3;

    draw_size += delta;
    draw_size = Math.max(mindraw, draw_size); // minimum is one
    draw_size = Math.min(maxdraw, draw_size); // maximum is 3
    
    // console.log(draw_size);

    $("#decrease_drawsize").css("text-decoration", "underline");
    $("#increase_drawsize").css("text-decoration", "underline");
    $("#decrease_drawsize").css("cursor", "pointer");
    $("#increase_drawsize").css("cursor", "pointer");


    if (draw_size == mindraw) {
        $("#decrease_drawsize").css("text-decoration", "none");
        $("#decrease_drawsize").css("cursor", "default");
    } else if (draw_size == maxdraw) {
        $("#increase_drawsize").css("text-decoration", "none");
        $("#increase_drawsize").css("cursor", "default");
    }
}


var faq_open = false;
const faq = $("#faq");
function toggle_faq() {
    /* open the tutorial/faq */
    faq_open = !faq_open;

    if (faq_open) {
        console.log('opening FAQ'); 
        $("#faq").css("display", "block");
    } else {
        console.log('closing FAQ'); 
        $("#faq").css("display", "none");
    }
}


var settings_open = false;
function toggle_settings() {
    /* manage overall settings */
    settings_open = !settings_open;

    if (settings_open) {
        console.log('opening settings menu'); 
        $("#settings-menu").css("display", "block");
    } else {
        console.log('closing settings menu'); 
        $("#settings-menu").css("display", "none");
    }
}

/* ------ IO management ------ */
var io_open = false;
var io = $("#io-menu");

function toggle_io() {
    /* manage importing/exporting maps */
    io_open = !io_open;

    if (io_open) {
        // console.log('opening IO menu'); 
        clear_io();
        $("#io-menu").css("display", "block");
    } else {
        // console.log('closing IO menu'); 
        $("#io-menu").css("display", "none");
    }

}


function clear_io() {
    let temp = $("#iotext").val();
    $("#iotext").val("");
    return temp; // return the content that was in the IO box before clearing
}

function set_io(content) {
    $("#iotext").val(content);
    return content;
}

function import_state() {
    /* create chars on screen based on input in io textbox */
    let newstate = clear_io();
    console.debug(`Importing state: ${newstate}`);

    toggle_io();

    return;
}

function export_state() {
    console.debug("Creating new state from entities...");
    set_io(JSON.stringify(entities));

    // TODO: copy to clipboard?
    $("#iotext").select();
    return;
}

function export_ascii() {
    /* fill text output with chars on screen */
    console.debug("Exporting ASCII image from current map...");

    let str_out = "";
    for (let i = 0; i < MAX_HEIGHT; i ++) {
        for (let j = 0; j < MAX_WIDTH; j ++) {
            str_out += $(`.${i}_${j}`).text();
            // console.log(i + ", " + j + ": " + $(`#${i}_${j}`).text());
        }
        str_out += '\n';
    }

    str_out += "© j-red 2022, j-red.github.io/vtt";

    set_io(str_out);

    $("#iotext").select();

    // TODO: copy to clipboard?
    return;
}


// ---------- end IO management -----------


/* CSS/Color Picker management */
// Get the root element
const r = document.querySelector(':root');

// Create a function for getting a variable value
function get_css(varname) {
    // Get the styles (properties and values) for the root
    var rs = getComputedStyle(r);
    // Alert the value of the --blue variable
    console.log(`The value of ${varname} is: ${rs.getPropertyValue(varname)}`);

    return rs.getPropertyValue(varname);
}

// Create a function for setting a variable value
function set_css(varname, value) {
    r.style.setProperty(varname, value);
}


function colorpicker_setup() {
    const bg_selector = document.getElementById('bg-selector');
    bg_selector.addEventListener('color-changed', (event) => {
        // get updated color value
        let newColor = event.detail.value;
        set_css('--bg-color', newColor);
    });

    // get current color value
    // console.log(bg_selector.color);

    // const fg_selector = document.getElementById('hex-color-picker');
    const fg_selector = document.getElementById('fg-selector');
    fg_selector.addEventListener('color-changed', (event) => {
        // get updated color value
        let newColor = event.detail.value;
        set_css('--fg-color', newColor);
    });

    // get current color value
    // console.log(fg_selector.color);

    const focus_selector = document.getElementById('focus-selector');
    focus_selector.addEventListener('color-changed', (event) => {
        // get updated color value
        let newColor = event.detail.value;
        set_css('--focused-color', newColor);
    });

    // get current color value
    // console.log(focus_selector.color);
}


// option settings menu

const option_slider_chars = 20; // how many characters to draw in sliders
const max_option = 10;

var option_01 = 10;
var option_01_index;
function option1 (delta) {
    option_01 = Math.max(Math.min(option_01 + delta, max_option), 0); // clamp range 0..max_option

    option_01_index = Math.floor((option_01 / max_option) * option_slider_chars);
    try {
        let str = "-".repeat(option_01_index - 1) + "|" + "-".repeat(option_slider_chars - option_01_index);
        $("#option-1-slider").text(str);
        $("#option-1-value").text(100 * (option_01 / max_option) + "%")
    } catch {
        // if current option is 0%
        $("#option-1-slider").text("|" + "-".repeat(option_slider_chars - 1));
        $("#option-1-value").text("0%")
    }


    return;
}

var option_02 = 10;
var option_02_index;
function option2 (delta) {
    option_02 = Math.max(Math.min(option_02 + delta, max_option), 0); // clamp range 0..max_option
    
    
    option_02_index = Math.floor((option_02 / max_option) * option_slider_chars);
    try {
        let str = "-".repeat(option_02_index - 1) + "|" + "-".repeat(option_slider_chars - option_02_index);
        $("#option-2-slider").text(str);
        $("#option-2-value").text(100 * (option_02 / max_option) + "%")
    } catch {
        // if current option is 0%
        $("#option-2-slider").text("|" + "-".repeat(option_slider_chars - 1));
        $("#option-2-value").text("0%")
    }

    
    return;
}

var option_03 = 10;
var option_03_index;
function option3 (delta) {
    option_03 = Math.max(Math.min(option_03 + delta, max_option), 0); // clamp range 0..max_option
    
    option_03_index = Math.floor((option_03 / max_option) * option_slider_chars);
    try {
        let str = "-".repeat(option_03_index - 1) + "|" + "-".repeat(option_slider_chars - option_03_index);
        $("#option-3-slider").text(str);
        $("#option-3-value").text(100 * (option_03 / max_option) + "%")
    } catch {
        // if current option is 0%
        $("#option-3-slider").text("|" + "-".repeat(option_slider_chars - 1));
        $("#option-3-value").text("0%")
    }
    
    return;
}