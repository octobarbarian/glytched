var SCALE = 4;
var TILE_ORIG_WIDTH = 16;
var TILE_ORIG_HEIGHT = 16;
var TILE_WIDTH = TILE_ORIG_WIDTH * 4;
var TILE_HEIGHT = TILE_ORIG_HEIGHT * 4;
var WINDOW_TILE_WIDTH = 9;
var WINDOW_TILE_HEIGHT = 9;
var WINDOW_WIDTH = WINDOW_TILE_WIDTH * TILE_WIDTH;
var WINDOW_HEIGHT = WINDOW_TILE_HEIGHT * TILE_HEIGHT;

/*
var socket = io.connect();
socket.emit('hello');
socket.on('hello', function (grid) {
    theGrid = grid;
});
*/

var stage, animation;

var currentDirection = 'still';
Mousetrap.bind('left', function() { currentDirection='left'; });
Mousetrap.bind('right', function() { currentDirection='right'; });
Mousetrap.bind('up', function() { currentDirection='up'; });
Mousetrap.bind('down', function() { currentDirection='down'; });

function init() {
    var canvas = document.getElementById('theCanvas');
    canvas.setAttribute('width', WINDOW_WIDTH);
    canvas.setAttribute('height', WINDOW_HEIGHT);

    var playersImage = loadAndResize('img/players.png', SCALE);
    var groundsImage = loadAndResize('img/grounds.png', SCALE);

    stage = new createjs.Stage("theCanvas");
			
    var data = {
	    images: [playersImage],
	    frames: {width:TILE_WIDTH, height:TILE_HEIGHT},
	    animations: {flower:[0,1], egg:[2,3], mouse:[4,5], hammer:[6,7], teapot:[8,9], soul:[10,11], jellyfish:[12,13], duck:[14,15], log:[16,17], pants:[18,19], umbrella:[20,21]}
    };
    var playerSheet = new createjs.SpriteSheet(data);
			
    data = {
	    images: [groundsImage],
	    frames: {width:TILE_WIDTH, height:TILE_HEIGHT}
    };
    var groundSheet = new createjs.SpriteSheet(data);
			
    for (var x = 0; x < WINDOW_TILE_WIDTH; x++) {
	    for (var y = 0; y < WINDOW_TILE_HEIGHT; y++) {
		    var background = new createjs.Sprite(groundSheet);
		    background.x = x*TILE_WIDTH;
		    background.y = y*TILE_HEIGHT;
		    background.gotoAndStop(6);
		    stage.addChild(background);
	    }
    }
			
    animation = new createjs.Sprite(playerSheet, "umbrella");
    animation.framerate = 4;
    animation.x = TILE_WIDTH * 4;
    animation.y = TILE_HEIGHT * 4;
    animation.play();
    stage.addChild(animation);

    createjs.Ticker.setFPS(30);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.addEventListener("tick", tick);    
}

function tick(event) {
	if (currentDirection === 'left') {
	    animation.scaleX = 1;
	    animation.regX = 0;
        animation.x = animation.x - SCALE;
	    if (animation.x < 0) { animation.x = WINDOW_WIDTH - TILE_WIDTH; }
	} else if (currentDirection === 'right') {
	    animation.scaleX = -1;
	    animation.regX = TILE_WIDTH;
        animation.x = animation.x + SCALE;
	    if (animation.x > WINDOW_WIDTH - TILE_WIDTH) { animation.x = 0; }
	} else if (currentDirection === 'up') {
	    animation.y = animation.y - SCALE;
	    if (animation.y < 0) { animation.y = WINDOW_HEIGHT - TILE_HEIGHT; }
	} else if (currentDirection === 'down') {
	    animation.y = animation.y + SCALE;
	    if (animation.y > WINDOW_HEIGHT - TILE_HEIGHT) { animation.y = 0; }
	}
    
	stage.update(event);
}

function loadAndResize (imgUrl, scale) {
    // Lovingly ripped off from PhobosLab at http://phoboslab.org/log/2012/09/drawing-pixels-is-hard
	var img = new Image();
	img.src = imgUrl;

    // Note: width-height may read as 0 if image is not preloaded
	var widthScaled = img.width * scale;
	var heightScaled = img.height * scale;

	var orig = document.createElement('canvas');
	orig.width = img.width;
	orig.height = img.height;
	var origCtx = orig.getContext('2d');
	origCtx.drawImage(img, 0, 0);
	var origPixels = origCtx.getImageData(0, 0, img.width, img.height);

	var scaled = document.createElement('canvas');
	scaled.width = widthScaled;
	scaled.height = heightScaled;
	var scaledCtx = scaled.getContext('2d');
	var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);

	for (var y = 0; y < heightScaled; y++) {
		for (var x = 0; x < widthScaled; x++) {
		    var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
		    var indexScaled = (y * widthScaled + x) * 4;
		    scaledPixels.data[indexScaled] = origPixels.data[index];
		    scaledPixels.data[indexScaled + 1] = origPixels.data[index + 1];
		    scaledPixels.data[indexScaled + 2] = origPixels.data[index + 2];
		    scaledPixels.data[indexScaled + 3] = origPixels.data[index + 3];
		}
	}
	scaledCtx.putImageData(scaledPixels, 0, 0);
	return scaled;
}
