// var shrink = 0.67;
var shrink = 0.7;
var minLen = 1;
var angleSlider;
var lengthSlider;
var slider;
var canvas;
var trunk = 50;

function setup() {
    canvas = createCanvas(500, 500);
    /* Assign parent to existing HTML with !!ID!! 'sketch' AFTER creating it */
    canvas.parent('sketch');

    // canvas.position(width/2, height/2)
    // angleSlider = createSlider(PI/16, 3 * PI / 4, PI/4, PI / 16);
    // lengthSlider = createSlider(1, 10, 5, 1);
    angleSlider = document.getElementById("angleSlider");
    angleSlider.setAttribute("min", PI / 16);
    angleSlider.setAttribute("max", 3 * PI / 4);
    angleSlider.setAttribute("step", PI / 16);
    angleSlider.setAttribute("value", PI / 4);
    lengthSlider = document.getElementById("lengthSlider");
    lengthSlider.setAttribute("min", 1);
    lengthSlider.setAttribute("max", 50);
    lengthSlider.setAttribute("step", -1);
    lengthSlider.setAttribute("value", 5);
}

function draw() {
    // background(51);
    background('#353b48');
    stroke(255);
    // angle = angleSlider.value();
    // minLen = lengthSlider.value();

    angle = angleSlider.value;
    minLen = lengthSlider.value;

    line(width/2, height, width/2, height-trunk)
    translate(width/2, height - trunk)
    branch(125);
}

function branch(len) {
    line(0, 0, 0, -len);
    translate(0, -len);

    if (len > minLen) {
        push();
        rotate(angle);
        branch(len * shrink);
        pop();
        push();
        rotate(-angle);
        branch(len * shrink);
        pop();
    }

}
