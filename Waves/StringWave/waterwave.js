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
    yaxis2 = 300, // same but second string
    animationSpeed = 5000,
    colorful = false,
    ampl_1 = 60, // height of the parabola green
    ampl_2 = 60, // red
    spread = 130, // Speed?
    alpha = 1,
    speed = 2.85; // this is the least jerky speed

var A = 1, // height kinda
    k_1 = 3, // width kinda
    omega_1 = 3, // how far pushed forward

    B = 1,
    k_2 = 3,
    omega_2 = -3,

    delta_x = 0.01, // frequency
    //delta_t = 0.01, // also time Original
    delta_t = 0.05,

    t = 16.52; // time?

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

    // $("#stepback").bind('click', function(event) {
    //     console.log("backwards")
    //     controlpanel.pause = true;
    //     center -= speed / 2;
    //     animate(animationSpeed);
    //     $("#pause").text('Continue');
    // });

    // $("#stepforward").bind('click', function(event) {
    //     console.log("forward")
    //     controlpanel.pause = true;
    //     center += speed / 2;
    //     animate(animationSpeed);
    //     $("#pause").text('Continue');
    // });

    $("#reset").bind('click', function(event) {
        console.log("reset")
        center = center_init;
        wave_x = 10;
        controlpanel.pause = true;
        animate(animationSpeed); // short animation which stops after one draw
        $("#pause").text('Start');
        controlpanel.started = false;
    });
    $("#color").bind('click', function(event) {
        console.log("colored")
        if (!colorful) {
            colorful = true;
           
        } else {
            colorful = false;
          
        }
        if (controlpanel.pause) { // need refreshing when paused
            animate(animationSpeed); // short animation which stops after one draw
        }
    });

    amplslider.bind('change', function(event) {
        if (!controlpanel.started) {
            ampl_2 = Number(amplslider.val());
            animate(animationSpeed); // short animation which stops after one draw
        }
    });
}

function animate(ms) {
    if (center < 2 * reflector - center_init) { // the animation is not yet ended
        if (!controlpanel.pause) {
            center += speed;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        PulseCollisionDraw(yaxis1, ampl_2, 1);
    } else { // the wave already gone to the end of the rope
        controlpanel.pause = true;
        controlpanel.started = false;
    }
    if (!controlpanel.pause) {
        setTimeout(animate, 33);
    }
}

function wavey(A,k_1,wave_x,omega_1,delta_t) { //math part
    return A * Math.sin(k_1 * wave_x - omega_1 * delta_t);
}

function PulseCollisionDraw(yaxis, ampl2, visible) {
	// Green String
    context.strokeStyle = "rgba(0, 255, 0)";
    context.beginPath();
    for (i = 0; i < (reflector / delta_x); i++) {
        wave_x = i + delta_x;
        wave_1_y = wavey(ampl_1, spread, center, wave_x, delta_t); //Works best
        wave_y = wave_1_y;
        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.moveTo(0, yaxis);
    context.closePath();
    context.stroke();

    // Red String
    context.strokeStyle = "rgba(255, 0, 0)";
    context.beginPath();
    for (i = 0; i < (2 * reflector / delta_x); i++) {

        wave_x = i + delta_x;
        wave_1_y = wavey(ampl_2, -spread, center, wave_x, delta_t); //Works best
        wave_y = wave_1_y;
        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.moveTo(reflector, yaxis);
    context.closePath();
    context.stroke();

    // Black String
    context.strokeStyle = "rgba(0, 0, 0)";
    context.beginPath();
    for (i = 0; i < (2*reflector / delta_x); i++) {
        wave_x = i + delta_x;
        wave_1_y = 44+ wavey(ampl_2, -spread, center, wave_x, delta_t); //******THis is it
        wave_y = wave_1_y;
        context.lineTo(wave_x, yaxis + wave_y);
    }
    //context.lineTo(0, yaxis);
    //context.moveTo(reflector, yaxis);
    //context.closePath();
    context.stroke();















}
