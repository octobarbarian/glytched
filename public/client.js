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
var goalX = Math.floor(WINDOW_TILE_WIDTH / 2) * TILE_WIDTH;
var goalY = Math.floor(WINDOW_TILE_HEIGHT / 2) * TILE_HEIGHT;

var pressedDirection = 'still';
Mousetrap.bind('left', function() { pressedDirection='left'; }, 'keydown');
Mousetrap.bind('right', function() { pressedDirection='right'; }, 'keydown');
Mousetrap.bind('up', function() { pressedDirection='up'; }, 'keydown');
Mousetrap.bind('down', function() { pressedDirection='down'; }, 'keydown');
Mousetrap.bind('left', function() { if(pressedDirection==='left') pressedDirection='still'; }, 'keyup');
Mousetrap.bind('right', function() { if(pressedDirection==='right') pressedDirection='still'; }, 'keyup');
Mousetrap.bind('up', function() { if(pressedDirection==='up') pressedDirection='still'; }, 'keyup');
Mousetrap.bind('down', function() { if(pressedDirection==='down') pressedDirection='still'; }, 'keyup');

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
    animation.x = goalX;
    animation.y = goalY;
    animation.play();
    stage.addChild(animation);

    createjs.Ticker.setFPS(30);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.addEventListener("tick", tick);    
}

function tick(event) {
    handlePlayerMovement();
    stage.update(event);
}

function handlePlayerMovement() {
    
    if (animation.x === goalX && animation.y === goalY) {
        animation.framerate = 4;
        if (pressedDirection === 'left') {
	        animation.scaleX = 1;
	        animation.regX = 0;
	        goalX = animation.x - TILE_WIDTH;
	    } else if (pressedDirection === 'right') {
	        animation.scaleX = -1;
	        animation.regX = TILE_WIDTH;
	        goalX = animation.x + TILE_WIDTH;
	    } else if (pressedDirection === 'up') {
	        goalY = animation.y - TILE_HEIGHT;
	    } else if (pressedDirection === 'down') {
	        goalY = animation.y + TILE_HEIGHT;
	    } else {
	        animation.framerate = 2;
	    }
    }

    if (animation.x < goalX) {
        animation.x += SCALE;
    } else if (animation.x > goalX) {
        animation.x -= SCALE;
    }
    
    if (animation.y < goalY) {
        animation.y += SCALE;
    } else if (animation.y > goalY) {
        animation.y -= SCALE;
    }
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
