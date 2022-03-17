var map = document.getElementById("map");

// const singleWalls = "─│┌┐└┘ ├┤┬┴┼";
// const doubleWalls = "═║╔╗╚╝ ╠╣╦╩╬"
const gradient = "█▓▒░";

const singleWalls = {
    horizontal: "─",
    h: "─",
    vertical: "│",
    v: "│",
    topleftcorner: "┌",
    tlc: "┌",
    toprightcorner: "┐",
    trc: "┐",
    bottomleftcorner: "└",
    blc: "└",
    bottomrightcorner: "┘",
    brc: "┘"
};

const doubleWalls = {
    horizontal: "═",
    h: "═",
    vertical: "║",
    v: "║",
    topleftcorner: "╔",
    tlc: "╔",
    toprightcorner: "╗",
    trc: "╗",
    bottomleftcorner: "╚",
    blc: "╚",
    bottomrightcorner: "╝",
    brc: "╝"
};

const empty = "&nbsp"; // char representing empty space
const gridcell = ".";  // char representing a visualized empty space

var walls = singleWalls; // single or double walls?

var CHARSIZE = { // default is 9px wide, 19px tall
    w: 9,
    h: 19
};

var MAX_WIDTH = 200; // maximum number of columns to draw
var MAX_HEIGHT = 48; // maximum number of rows to draw

var map_width = $('body').width();
var map_height = $('body').height();
MAX_WIDTH = Math.min(Math.floor(map_width / CHARSIZE.w), MAX_WIDTH);
MAX_HEIGHT = Math.min(Math.floor(map_height / CHARSIZE.h), MAX_HEIGHT);


// const grid = 1; // draw dot on every cell
const grid = 5; // draw dot on every 5 cells


var first_load = true; // might be useful at some point! not used yet.

window.addEventListener('resize', redraw);
window.addEventListener('load', function() { 
    redraw();
}, false);


function redraw() {
    // console.debug("Called redraw")
    map.innerHTML = "";

    var map_width = $('body').width();
    var map_height = $('body').height();
    MAX_WIDTH = Math.floor(map_width / CHARSIZE.w), MAX_WIDTH;
    MAX_HEIGHT = Math.floor(map_height / CHARSIZE.h), MAX_HEIGHT;

    for (let i = 0; i < MAX_HEIGHT; i ++) {
        let content = "";
        
        // content += "<p>";
        // content += walls["v"] + (empty.repeat(MAX_WIDTH - 2)) + walls["v"];
        // content += "</p>";
    
        var row = document.createElement("div");
        row.setAttribute("class", "row " + i);
    
        if (i == 0)  { // if first row:
            // content += "<span>" + walls["tlc"] + (walls["h"].repeat(MAX_WIDTH - 2)) + walls["trc"] + "</span>";
    
            for (let j = 0; j < MAX_WIDTH; j ++) {
                content += `<span class='${i} ${j} ${i}_${j}'>`;
                if (j == 0) {
                    // first column
                    content += walls['tlc'];
                } else if (j == MAX_WIDTH - 1) {
                    // last column
                    content += walls['trc'];
                } else {
                    // middle column
                    content += walls['h'];
                }
                content += "</span>";
            }
        } else if (i == MAX_HEIGHT - 1) { // if last row:
            for (let j = 0; j < MAX_WIDTH; j ++) {
                content += `<span class='${i} ${j} ${i}_${j}'>`;
                if (j == 0) {
                    // first column
                    content += walls['blc'];
                } else if (j == MAX_WIDTH - 1) {
                    // last column
                    content += walls['brc'];
                } else {
                    // middle column
                    content += walls['h'];
                }
                content += "</span>";
            }
        } else { // if middle row:
            content += `<span class='${i} ${0} ${i}_${0}'>` + walls["v"] + "</span>";
    
            for(let j = 1; j < MAX_WIDTH - 1; j ++) {
                content += `<span class='${i} ${j} ${i}_${j}'>`;
                content += ((i % grid == 0) && (j % grid == 0) ? gridcell : empty);
                content += "</span>";
            }
    
            content += `<span class='${i} ${MAX_WIDTH - 1} ${i}_${MAX_WIDTH - 1}'>` + walls["v"] + "</span>";
        }
    
        row.innerHTML = content;
        map.append(row);
    } // end for row in rows

    // reveal existing entities
    for (let e = 0; e < entities.length; e++) {
        entities[e].reveal();
    }

    first_load = false; // the window has been loaded, meaning we should check if entities exist when writing in new screens

} // end redraw


