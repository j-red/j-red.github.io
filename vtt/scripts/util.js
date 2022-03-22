// https://javascript.plainenglish.io/convert-hex-to-rgb-with-javascript-4984d16219c3
String.prototype.convertToRGB = function(){
    let str = this;

    if (str.charAt(0) == "#") {
        str.splice(0, 1); // remove leading hash
        console.log(str);
    }


    if(str.length != 6){
        throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = str.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    return aRgb;
}


// Local storage options:
if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    function save_data(key, value) {
        // Store
        // console.debug(`saved ${key} as ${value} in session data`);
        return localStorage.setItem(key, value);
    }

    function load_data(key) {
        // Retrieve
        // console.debug(`${key} was ${localStorage.getItem(key)} in session data`);
        return localStorage.getItem(key);
    }

    function clear_data(key) {
        localStorage.clear(key);
    }

    function save_state() {
        return save_data('map_state', export_state());
    }

    function load_state() {
        return import_state(load_data('map_state'));
    }
} else {
    // Sorry! No Web Storage support..
    console.warn('Local storage not supported on this browser. Attempts to save and load data locally will not function. Make sure you use the IO menu to save your work!');

    function save_data(key, value) {
        console.error('Local storage not supported on this browser. Send me a message if you want to see this implemented!');
        return null;
    }

    function load_data(key) {
        console.error('Local storage not supported on this browser. Send me a message if you want to see this implemented!');
        return null;
    }

    function clear_data(key) {
        console.error('Local storage not supported on this browser. Send me a message if you want to see this implemented!');
        return null;
    }

    function save_state() {
        throw 'Local storage not supported on this browser. Send me a message if you want to see this implemented!';
    }

    function load_state() {
        console.error('Local storage not supported on this browser. Send me a message if you want to see this implemented!');
        return null;
    }
}


// saved map storage options
function load_save(index) {
    let state = localStorage.getItem(`saved_map_${index}`);
    if (state != null) {
        // load map
        import_state(state);
    } else {
        // save map
        localStorage.setItem(`saved_map_${index}`, export_state());
        $('#io-save-' + index).text('0' + (index + 1));
    }
    return;
}

function clear_save(index, noconfirm = true) {
    if ($('#io-save-' + index).text() === '--') return;

    if (noconfirm || confirm(`are you sure you wish to delete save 0${index + 1}?`)) {
        localStorage.removeItem(`saved_map_${index}`);
        $('#io-save-' + index).text('--');
    }
    return;
}

// fullscreen settings
var fullscreen_open = false;
function toggle_fullscreen(enable = null) {
    if (enable != null) {
        fullscreen_open = enable;
    } else {
        fullscreen_open = !fullscreen_open;
    }

    if (fullscreen_open) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen()
    }
}


// page load settings
var colorsHaveLoaded = false;
function on_load() {
    /* this function called on page load */
    // console.debug("called on_load");

    load_state(); // try to load from local session storage
    save_state();
    setInterval(save_state, 5000); // save state every 5 seconds

    // open welcome menu, if applicable
    if (!(load_data('_welcome') != null)) {
        // console.log('opening welcome menu');
        toggle_welcome(); // open welcome menu
    }
    
    // update saved state button labels
    for (let i = 0; i < 9; i ++) {
        if (localStorage.getItem(`saved_map_${i}`) != null)
            $('#io-save-' + i).text('0' + (i + 1));
    }

    let loadcssvars = ['--bg-color', '--fg-color', '--focused-color']; 
    for (let i in loadcssvars) {
        let cached = load_data(loadcssvars[i]);
        if (cached != null) {
            set_css(loadcssvars[i], cached);
            // console.debug(`loaded ${loadcssvars[i]} to ${load_data(loadcssvars[i])} from session data`);
        } else {
            // console.debug(`key '${loadcssvars[i]}' not found in session data`);
        }
    }
    colorsHaveLoaded = true;


    /* set rightsidebar button if map is empty */
    if (entities.length === 0) {
        rightsidebar_active = "rsb_walls";
        $("#rsb_walls").addClass('focused');
    } else {
        /* do not select tool if map not empty */
    }


    return;
}