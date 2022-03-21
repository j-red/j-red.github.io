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
        return localStorage.setItem(key, value);
    }

    function load_data(key) {
        // Retrieve
        return localStorage.getItem(key);
    }
} else {
    // Sorry! No Web Storage support..
    console.warn('Local storage not supported on this browser. Attempts to save and load data locally will not function. Make sure you use the IO menu to save your work!');

    function save_data(key, value) {
        console.error('Local storage not supported on this browser. Send me a message if you want to see this implemented!');
        return null;
    }

    function load_data(key, value) {
        console.error('Local storage not supported on this browser. Send me a message if you want to see this implemented!');
        return null;
    }
}

