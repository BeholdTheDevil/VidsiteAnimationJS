var canvas = document.getElementById("modalAnimation");
canvas.width = 640;
canvas.height = 480;
canvas.style.width = canvas.width;
canvas.style.height = canvas.height;

var ctx = canvas.getContext("2d");
var frame = 0;
var maxFrame = 540;
var status = null;
var slider = document.getElementById("slider");
slider.max = maxFrame;

var stop = document.getElementById("stop");
var play = document.getElementById("play");
var pause = document.getElementById("pause");
var start, ms;

clearCanvas();
renderTime(frame, 0);

slider.addEventListener("change", function() {
	frame = slider.value;
	clearCanvas();
	timeline();
	renderTime(frame, 0);
}, true);

stop.addEventListener("click", function() {
	clearInterval(status);
	frame = 0;
	slider.value = frame;
	status = null;
	clearCanvas();
	renderTime(frame, 0);

	titleText.reset();
	pendulum.reset();
	play.textContent = "Play";
}, true);

play.addEventListener("click", function() {
	if (status === "null") {
		start = Date.now();
		status = setInterval(timeline, 33.333333333333336);
		play.textContent = "Pause";
	} else {
		clearInterval(status);
		status = null;
		play.textContent = "Play";
	}
}, true);

function timeline() {

	slider.value = frame;
	ms = Date.now() - start;
	//console.log("Seconds elapsed = " + ms/1000);

	if(frame%2 == 0) {

		clearCanvas();
		//Animation begins here

		pendulum.animate(frame);
		titleText.animate(frame);

		//Animation ends here
		renderTime(frame, ms);
	}

	if (frame == maxFrame) {
		clearInterval(status);
		status = null;
	}
	frame++;
}

function clearCanvas() {
	ctx.fillStyle = "rgb(147, 210, 220)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderTime(f, time) {
	ctx.font = "16px Encode Sans";
	ctx.fillStyle = "black";
	ctx.fillText("Frame: " + f + ", Time elapsed: " + time/1000 + "s", 4, 20);
}

var titleText = {
	color: "rgb(250, 250, 230)",
	xstart: 100,
	ystart: -50,
	x: 100,
	y: -50,
	text: "Mekanisk energi",
	start: 0,
	speed: 10,
	end: 120,
	animate: function(f) {

		if(f >= this.start && f <= this.end) {
			if(f <= 30) {
				this.y = this.ystart + (f - this.start) * this.speed;
			} else if(f >= 60) {
				this.y = this.ystart + (f - this.start - 30) * this.speed;
			}
			ctx.fillStyle = this.color;
			ctx.font = "68px 'Josefin Sans'";
			ctx.fillText(this.text, this.x, this.y);
		}
	},
	reset: function(f) {
		this.x = this.xstart;
		this.y = this.ystart;
	}
}


var pendulum = {
	color: "rgb(235, 89, 61)",
	xstart: 320,
	ystart: 200,
	radius: 200,
	x: 0,
	y: 0,
	angle: 0,
	size: 30,
	theta: Math.PI/3,
	speed: 5,
	acc: 0,
	dist: 0,
	start: 90,
	end: 540,
	animate: function(f) {
		var dx, dy;

		if (f >= this.start && f <= this.end) {
			this.angle = this.theta*Math.cos(Math.sqrt(this.speed/this.radius) * 0.5*(f - this.start));

			dx = this.radius*Math.cos(this.angle + Math.PI/2);
			dy = this.radius*Math.sin(this.angle + Math.PI/2);

			this.x = this.xstart + dx;
			this.y = this.ystart + dy;

			ctx.beginPath();
		    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
		    ctx.fillStyle = this.color;
		    ctx.fill();

			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle=this.color;
			ctx.moveTo(this.xstart,this. ystart);
			ctx.lineTo(this.x, this.y);
			ctx.stroke();
		}
	},
	reset: function() {
		this.x = this.xstart;
		this.y = this.ystart;
	}
}
