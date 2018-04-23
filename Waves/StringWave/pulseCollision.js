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

var center_init;
var center;
var spread;
var wave_x;
var delta_x;
var wave_y;
var wave_1_y;
var wave_2_y;
var reflector;
var speed = 3;
var alpha = 1;
var colorful = false;
var ampl_1;
var ampl_2;
var yaxis1 = 200;
var yaxis2 = 300;
var animationSpeed = 5000;

function init() {
    spread = 30; // never changed after init
    center_init = 0.15 * canvas.width;
    center = center_init;
    wave_x = 10;
    wave_1_y = 0;
    wave_2_y = 0;
    wave_3_y = 0;
    ampl_1 = 60;
    ampl_2 = 60;

    delta_x = 0.5;
    reflector = 0.5 * canvas.width; // never changed after init

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
        controlpanel.pause = true;
        center -= speed / 2;
        animate(animationSpeed);
        $("#pause").text('Continue');
    });

    $("#stepforward").bind('click', function(event) {
        controlpanel.pause = true;
        center += speed / 2;
        animate(animationSpeed);
        $("#pause").text('Continue');
    });

    $("#reset").bind('click', function(event) {
        center = center_init;
        wave_x = 10;
        controlpanel.pause = true;
        animate(animationSpeed); // short animation which stops after one draw
        $("#pause").text('Start');
        controlpanel.started = false;
    });
    $("#color").bind('click', function(event) {
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

function wavey(amp, wavex, center, spread) {
    return (amp * Math.exp(-((wavex - center) * (wavex - center) / (spread * spread))));
}

function PulseCollisionDraw(yaxis, ampl2, visible) {

    if (colorful) {
        context.lineWidth = 3;
        // left 
        context.strokeStyle = "rgba(0, 255, 0, " + Number(1 * visible) + ")";
        context.beginPath();
        for (i = 0; i < (reflector / delta_x); i++) {
            wave_x = i * delta_x;
            wave_y = yaxis + wave_1_y + wave_2_y;

            wave_1_y = wavey(-1 * ampl_1, wave_x, center, spread);
            wave_2_y = wavey(ampl2, wave_x, 2 * reflector - center, spread);

            context.lineTo(wave_x, yaxis + wave_1_y);
        }
        context.moveTo(0, yaxis);
        context.closePath();
        context.stroke();
        context.strokeStyle = "rgba(255, 0, 0, " + Number(1 * visible) + ")";
        context.beginPath();
        for (i = 0; i < (reflector / delta_x); i++) {
            wave_x = i * delta_x;
            wave_y = wave_1_y + wave_2_y;

            wave_1_y = wavey(-1 * ampl_1, wave_x, center, spread);
            wave_2_y = wavey(ampl2, wave_x, 2 * reflector - center, spread);

            context.lineTo(wave_x, yaxis + wave_2_y);
        }
        context.moveTo(reflector, yaxis);
        context.closePath();
        context.stroke();

        //right 
        // context.strokeStyle = "rgba(0, 255, 0, " + Number(alpha * visible) + ")";
        // context.beginPath();
        // for (i = reflector / delta_x; i < (2 * reflector / delta_x); i++) {
        //     wave_x = i * delta_x;
        //     wave_y = yaxis + wave_1_y + wave_2_y;

        //     wave_1_y = wavey(-1 * ampl_1, wave_x, center, spread);
        //     wave_2_y = wavey(ampl2, wave_x, 2 * reflector - center, spread);

        //     context.lineTo(wave_x, yaxis + wave_1_y);
        // }
        // context.moveTo(0, yaxis);
        // context.closePath();
        // context.stroke();
        // context.strokeStyle = "rgba(255, 0, 0, " + Number(1 * visible) + ")";
        // context.beginPath();
        // for (i = reflector / delta_x; i < (2 * reflector / delta_x); i++) {
        //     wave_x = i * delta_x;
        //     wave_y = wave_1_y + wave_2_y;

        //     wave_1_y = wavey(-1 * ampl_1, wave_x, center, spread);
        //     wave_2_y = wavey(ampl2, wave_x, 2 * reflector - center, spread);

        //     context.lineTo(wave_x, yaxis + wave_2_y);
        // }
        // context.moveTo(reflector, yaxis);
        // context.closePath();
        // context.stroke();
    }

    // black string
    context.lineWidth = 1.5;
    // left 
    context.strokeStyle = "rgba(0, 0, 0, " + Number(1) + ")";
    context.beginPath();
    for (i = 0; i < (reflector / delta_x); i++) {
        wave_x = i * delta_x;

        wave_1_y = wavey(-1 * ampl_1, wave_x, center, spread);
        wave_2_y = wavey(ampl2, wave_x, 2 * reflector - center, spread);
        wave_y = wave_1_y + wave_2_y;

        context.lineTo(wave_x, yaxis + wave_y);
    }
    context.moveTo(0, yaxis);
    context.closePath();
    context.stroke();
    //right
    // context.strokeStyle = "rgba(0, 0, 0, " + Number(alpha * visible) + ")";
    // context.beginPath();
    // for (i = reflector / delta_x; i < (2 * reflector / delta_x); i++) {
    //     wave_x = i * delta_x;

    //     wave_1_y = wavey(-1 * ampl_1, wave_x, center, spread);
    //     wave_2_y = wavey(ampl2, wave_x, 2 * reflector - center, spread);
    //     wave_y = wave_1_y + wave_2_y;

    //     context.lineTo(wave_x, yaxis + wave_y);
    // }
    // context.moveTo(reflector, yaxis);
    // context.closePath();
    // context.stroke();
}
