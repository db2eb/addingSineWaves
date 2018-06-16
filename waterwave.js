// Author: David Bang
// Derived from pulseCollision.js
function ControlPanel() {
    this.pause = true;
    this.started = false;
}

var canvas = $("#canvas1");
canvas.width = canvas.attr('width');
canvas.height = canvas.attr('height');
var context = canvas.get(0).getContext("2d"),
    controlpanel = new ControlPanel();
var amplslider_1 = $("#ampl_1"), // sliders
    amplslider_2 = $("#ampl_2"),
    waveslider_1 = $("#waveWidth_1"),
    waveslider_2 = $("#waveWidth_2"),
	colorString = 1,
	blackString = 3;

var center_init = 0.15 * canvas.width,//where it starts 
    center = center_init,
    reflector = canvas.width, // how far you want to go
    yaxis1 = 250, //position in y axis
    animationSpeed = 50,//5000
    spread = 130, // Stick with this number
    delta_x = 0.015, // frequency
    delta_t = 0.05,
    step = .0005;

function init() {
    addEventlisteners();
    amplslider_1.trigger('change'); // update the slider value
    amplslider_2.trigger('change'); 
    waveslider_1.trigger('change');
    waveslider_2.trigger('change');
}

init();
animate(animationSpeed); // short animation which stops after one draw

document.getElementById('reset').onclick = function(){
	if(controlpanel.pause == false)
		controlpanel.pause = true;
    document.getElementById("test").reset();//resets sliders but not values
    ampl_1 = document.getElementById('ampl_1').value = 60;
    ampl_2 = document.getElementById('ampl_2').value = 60;
    waveWidth_1 = document.getElementById('waveWidth_1').value = 1;
    waveWidth_2 = document.getElementById('waveWidth_2').value = 1;
    center = center_init;
    wave_x = 10;
    animate(animationSpeed);
};

function addEventlisteners() {
    $("#pause").bind('click', function(event) {
        if (controlpanel.pause==true) {
            controlpanel.pause = false;
            $(this).text('Pause');
            animate(animationSpeed);
        } 
        else if (controlpanel.pause==false){ // click pause
            controlpanel.pause = true;
            $(this).text('Start');
        }
    });

    $("#stepback").bind('click', function(event) {
        controlpanel.pause = true;
        center = center - step;
        animate(animationSpeed);
        $("#pause").text('Start');
    });

    $("#stepforward").bind('click', function(event) {
        controlpanel.pause = true;
        center = center + step;
        animate(animationSpeed);
        $("#pause").text('Start');
    });

    amplslider_1.bind('change', function(event) { //ampl_1 is green string
        if (controlpanel.pause) { // Changed from !controlpanel.started,
            ampl_1 = Number(amplslider_1.val()); // allows editing after pausing
            animate(animationSpeed);
        }
    });
    amplslider_2.bind('change', function(event) { //ampl_2 is red string
        if (controlpanel.pause) {
            ampl_2 = Number(amplslider_2.val());
            animate(animationSpeed);
        }
    });
    waveslider_1.bind('change', function(event) {
        if (controlpanel.pause) {
            waveWidth_1 = Number(waveslider_1.val());
            animate(animationSpeed);
        }
    });
    waveslider_2.bind('change', function(event) {
        if (controlpanel.pause) {
            waveWidth_2 = Number(waveslider_2.val());
            animate(animationSpeed);
        }
    });
}

function animate(ms) {
    if (center < 2 * reflector - center_init) {
        if (!controlpanel.pause) {
            center += step;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        PulseCollisionDraw(yaxis1, ampl_2, 1);
    } else { 
        controlpanel.pause = true;
    }
    if (!controlpanel.pause) {
        setTimeout(animate, 10);
    }
}

function wavey(A,k_1,wave_x,omega_1,delta_t) { // Math part
    return A * Math.sin(k_1 * wave_x - omega_1 * delta_t);
}

function PulseCollisionDraw(yaxis, ampl2, visible) {
	// Green String
    context.strokeStyle = "#007700";
    context.lineWidth=colorString;
    context.beginPath();
    for (i = 0; i < (reflector / delta_x); i++) {
        wave_x = i + delta_x;
        wave_y = wavey(ampl_1, spread, center, waveWidth_1*wave_x, delta_t);
        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.stroke();

    // Red String
    context.strokeStyle = "#ff0000";
    context.lineWidth = colorString;
    context.beginPath();
    for (i = 0; i < (reflector / delta_x); i++) {
        wave_x = i + delta_x;
        wave_y = wavey(ampl_2, -spread, center, waveWidth_2*wave_x, delta_t);
        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.stroke();

    // Black String
    context.strokeStyle = "#000000";
    context.lineWidth = blackString;
    context.beginPath();
    for (i = 0; i < (reflector / delta_x); i++) {
        wave_x = i + delta_x;
        wave_y = wavey(ampl_1, spread, center, waveWidth_1*wave_x, delta_t) 
        	+ wavey(ampl_2, -spread, center, waveWidth_2*wave_x, delta_t);
        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.stroke();
}
