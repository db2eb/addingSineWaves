// Author: David Bang
// Derived from pulseCollision.js
function ControlPanel() {
    this.pause = true;
    this.started = false;
}

var canvas = $("#canvas1");
canvas.width = canvas.attr('width');
canvas.height = canvas.attr('height');
var context = canvas.get(0).getContext("2d");
var controlpanel = new ControlPanel();
var amplslider = $("#ampl");
var center_init = 0.15 * canvas.width,//where it starts 
    center = center_init,
    reflector = canvas.width, // how far you want to go
    yaxis1 = 250, //position in y axis
    animationSpeed = 5000,
    ampl_1 = 60, // height of the parabola green
    //ampl_2 = 60, // red, not important bc there is a slider
    spread = 130, // Speed?
    speed = 2.85, // this is the least jerky speed
    delta_x = 0.01, // frequency
    delta_t = 0.05;

function init() {
    addEventlisteners();
    amplslider.trigger('change'); // update the slider value
}

init();
animate(animationSpeed); // short animation which stops after one draw

function addEventlisteners() {
    $("#pause").bind('click', function(event) {
        if ($(this).text() == "Start") {
            controlpanel.pause = false;
            controlpanel.started = true;
            $(this).text('Pause');
            animate(animationSpeed);
        } else if ($(this).text() == "Continue") { // click continue
            controlpanel.pause = false;
            $(this).text('Pause');
            animate(animationSpeed);
        } else { // click pause
            controlpanel.pause = true;
            $(this).text('Continue');
        }
    });

    $("#stepback").bind('click', function(event) {
        console.log("backwards")
        controlpanel.pause = true;
        center = center - .0005;
        animate(animationSpeed);
        $("#pause").text('Continue');
    });

    $("#stepforward").bind('click', function(event) {
        console.log("forward")
        controlpanel.pause = true;
        center = center + .0005;
        animate(animationSpeed);
        $("#pause").text('Continue');
    });

    $("#reset").bind('click', function(event) {
        console.log("reset")
        center = center_init;
        wave_x = 10;
        controlpanel.pause = true;
        animate(animationSpeed); // short animation which stops after one draw
        $("#pause").text('Start');
        controlpanel.started = false;
    });

    amplslider.bind('change', function(event) { //ampl_2 is red string
        if (!controlpanel.started) {
            ampl_2 = Number(amplslider.val());
            animate(animationSpeed); // short animation which stops after one draw
        }
    });
}

function animate(ms) {
    if (center < 2 * reflector - center_init) {
        if (!controlpanel.pause) {
            center += speed;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        PulseCollisionDraw(yaxis1, ampl_2, 1);
    } else { 
        controlpanel.pause = true;
        controlpanel.started = false;
    }
    if (!controlpanel.pause) {
        setTimeout(animate, 33);
    }
}

function wavey(A,k_1,wave_x,omega_1,delta_t) { // Math part
    return A * Math.sin(k_1 * wave_x - omega_1 * delta_t);
}

function PulseCollisionDraw(yaxis, ampl2, visible) {
	// Green String
    context.strokeStyle = "rgba(0, 255, 0)";
    context.beginPath();
    for (i = 0; i < (reflector / delta_x); i++) {
        wave_x = i + delta_x;
        wave_1_y = wavey(ampl_1, spread, center, wave_x, delta_t);
        wave_y = wave_1_y;
        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.stroke();

    // Red String
    context.strokeStyle = "rgba(255, 0, 0)";
    context.beginPath();
    for (i = 0; i < (reflector / delta_x); i++) {
        wave_x = i + delta_x;
        wave_1_y = wavey(ampl_2, -spread, center, wave_x, delta_t);
        wave_y = wave_1_y;
        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.stroke();

    // Black String
    context.strokeStyle = "rgba(0, 0, 0)";
    context.beginPath();
    for (i = 0; i < (reflector / delta_x); i++) {
        wave_x = i + delta_x;
        wave_1_y = wavey(ampl_1, spread, center, wave_x, delta_t) + wavey(ampl_2, -spread, center, wave_x, delta_t); //******THis is it
        wave_y = wave_1_y;
        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.stroke();
}
