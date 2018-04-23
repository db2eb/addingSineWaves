function ControlPanel() {
    this.pause = true;
    this.started = false;
}

var canvas = $("#canvas1");
var context = canvas.get(0).getContext("2d");
var controlPanel = new ControlPanel();
var thicknessSlider = $("#thickness");
var ampSlider = $("#amplitude");

var center_init;
var center;
var spread;
var wave_x;
var delta_x;
var wave_y;
var wave_1_y;
var wave_2_y;
var wave_3_y;
var reflector;
var speed = 3;
var r = 2; //ratio of speeds before and after join
var mu_left; // line thickness
var mu_right; // line thickness
var animationSpeed = 5000;
var stringPositionY = 120;
var amplitude = 50; // can make it changeable

$(window).resize(resizeCanvas());
function resizeCanvas() {
    canvas.attr('width', $(window).width() * 0.9);
    canvas.width = canvas.attr('width');
    canvas.height = canvas.attr('height');
}
$(window).resize();

function init() {
    spread = 30; // never changed after init
    center_init = 0.15 * canvas.width;
    center = center_init;
    wave_x = 10;
    wave_1_y = 0;
    wave_2_y = 0;
    wave_3_y = 0;

    delta_x = 0.5;
    reflector = 0.5 * canvas.width; // never changed after init

    addEventListeners();
    switchButton('play');
    thicknessSlider.trigger('change'); // update the slider value
    ampSlider.trigger('change');
}

init();
animate(animationSpeed); // short animation which stops after one draw

function buttonHtml(glyphicon, text) {
    return '<span class="glyphicon glyphicon-' + glyphicon + '"></span> <span class="btn-text">' + text + '</span>';
}

function addEventListeners() {

    $("#play").bind('click', function () {
        controlPanel.pause = false;
        controlPanel.started = true;
        //$(this).html(buttonHtml('pause', 'Pause'));
        switchButton('pause');
        animate(animationSpeed);
    });
    $("#continue").bind('click', function () {
        controlPanel.pause = false;
        switchButton('pause');
        animate(animationSpeed);

    });

    $("#pause").bind('click', function () {
        controlPanel.pause = true;
        switchButton('continue');
    });

    //$("#pause").bind('click', function (event) {
    //    if ($(this).text().trim() == "Start") { // click start
    //        controlPanel.pause = false;
    //        controlPanel.started = true;
    //        $(this).html(buttonHtml('pause', 'Pause'));
    //        animate(animationSpeed);
    //    } else if ($(this).text().trim() == "Continue") { // click continue
    //        controlPanel.pause = false;
    //        $(this).html(buttonHtml('pause', 'Pause'));
    //        animate(animationSpeed);
    //    } else { // click pause
    //        controlPanel.pause = true;
    //        $(this).html(buttonHtml('play', 'Continue'));
    //    }
    //});

    $("#stepback").bind('click', function (event) {
        controlPanel.pause = true;
        center -= speed / 2;
        animate(animationSpeed);
        //$("#pause").html(buttonHtml('play', 'Continue'));
        switchButton('continue');
    });

    $("#stepforward").bind('click', function (event) {
        controlPanel.pause = true;
        center += speed / 2;
        animate(animationSpeed);
        //$("#pause").html(buttonHtml('play', 'Continue'));
        switchButton('continue');
    });

    $("#reset").bind('click', function (event) {
        center = center_init;
        wave_x = 10;
        controlPanel.pause = true;
        animate(animationSpeed); // short animation which stops after one draw
        //$("#pause").html(buttonHtml('play', 'Start'));
        switchButton('play');
        controlPanel.started = false;
    });

    thicknessSlider.bind('change', function (event) {
        if (!controlPanel.started) {
            if (Number(thicknessSlider.val()) <= 1) {
                r = Number(thicknessSlider.val());
                mu_left = Math.ceil(r);
                mu_right = Math.floor(11 - 10 * r);
            } else {
                r = Number(10 * (thicknessSlider.val() - 1) + 1);
                mu_left = Math.floor(r);
                mu_right = Math.ceil(r / 10);
            }
            animate(animationSpeed); // short animation which stops after one draw
        }
    });

    ampSlider.bind('change', function (event) {
        if (!controlPanel.started) {
            amplitude = (Number(ampSlider.val()));
            animate(animationSpeed); // short animation which stops after one draw
        }
    });

    $("#toggleBtnText").bind('click', function () {
        $(".btn-text").toggle();
    });

}


function animate(ms) {

    if (center < 2 * reflector - center_init) { // the animation is not yet ended
        if (!controlPanel.pause) {
            center += speed;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        MismatchWaveDraw();

    } else { // the wave already gone to the end of the rope
        controlPanel.pause = true;
        controlPanel.started = false;
    }
    if (!controlPanel.pause) {
        setTimeout(animate, 33);
    }
}

function switchButton(s) {
    if (s == "play") {
        $("#pause").hide();
        $("#continue").hide();
        $("#play").show();
    } else if (s == "pause") {
        $("#play").hide();
        $("#continue").hide();
        $("#pause").show();
    } else if (s == "continue") {
        $("#play").hide();
        $("#pause").hide();
        $("#continue").show();
    }
}

function MismatchWaveDraw() {

    // left
    context.moveTo(0, stringPositionY);
    context.beginPath();
    context.strokeStyle = "#000000";
    context.lineWidth = mu_left + 1; // alpha is 1
    var i;
    for (i = 0; i < reflector / delta_x; i++) {
        wave_x = i * delta_x;
        wave_y = stringPositionY + wave_1_y + wave_2_y + +wave_3_y;

        wave_1_y = -(amplitude * Math.exp(-((wave_x - center) * (wave_x - center) / (spread * spread))));
        wave_2_y = -(amplitude * ((r - 1) / (r + 1)) * Math.exp(-((wave_x - (2 * reflector - center)) * (wave_x - (2 * reflector - center)) / (spread * spread))));
        wave_3_y = -(amplitude * (2 * r / (1 + r)) * Math.exp(-((wave_x - ((1 - r) * reflector + r * center)) * (wave_x - ((1 - r) * reflector + r * center)) / (r * r * spread * spread))));

        wave_y = stringPositionY + wave_1_y + wave_2_y;
        context.lineTo(wave_x, wave_y);

    }
    context.moveTo(0, stringPositionY); // left end of the string
    context.closePath();
    context.stroke();

    context.beginPath();
    context.strokeStyle = "#ff0000";
    context.lineWidth = mu_right + 1; // alpha is 1


    //right part
    for (i = reflector / delta_x; i < 2 * reflector / delta_x; i++) {
        wave_x = i * delta_x;
        wave_y = stringPositionY + wave_1_y + wave_2_y + +wave_3_y;

        wave_1_y = -(amplitude * Math.exp(-((wave_x - center) * (wave_x - center) / (spread * spread))));
        wave_2_y = -(amplitude * ((r - 1) / (r + 1)) * Math.exp(-((wave_x - (2 * reflector - center)) * (wave_x - (2 * reflector - center)) / (spread * spread))));
        wave_3_y = -(amplitude * (2 * r / (1 + r)) * Math.exp(-((wave_x - ((1 - r) * reflector + r * center)) * (wave_x - ((1 - r) * reflector + r * center)) / (r * r * spread * spread))));

        wave_y = stringPositionY + wave_3_y;
        context.lineTo(wave_x, wave_y);
    }
    context.moveTo(reflector, stringPositionY);
    context.closePath();
    context.stroke();

}
