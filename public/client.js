var TILE_ORIG_WIDTH = 16;
var TILE_ORIG_HEIGHT = 16;
var WINDOW_TILE_WIDTH = 15;
var WINDOW_TILE_HEIGHT = 9;
var SCALE, TILE_WIDTH, TILE_HEIGHT, WINDOW_WIDTH, WINDOW_HEIGHT;

var socket, game, stage, me, spriteSheet;
var pressedDirection = 'still';

$(function () {
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();

    // desired grid is 20 wide by 10 high
    var widthScale = Math.floor(viewportWidth / TILE_ORIG_WIDTH / 20);
    var heightScale = Math.floor(viewportHeight / TILE_ORIG_HEIGHT / 10);

    SCALE = Math.min(widthScale, heightScale);
    TILE_WIDTH = TILE_ORIG_WIDTH * SCALE;
    TILE_HEIGHT = TILE_ORIG_HEIGHT * SCALE;
    WINDOW_WIDTH = WINDOW_TILE_WIDTH * TILE_WIDTH;
    WINDOW_HEIGHT = WINDOW_TILE_HEIGHT * TILE_HEIGHT;

    $('#header')
        .css('font-size', (SCALE * 10) + 'px')
        .css('height', Math.floor(SCALE * TILE_ORIG_HEIGHT * 0.75));

    $('#theCanvas')
        .attr('width', WINDOW_WIDTH)
        .attr('height', WINDOW_HEIGHT)
        .css('width', WINDOW_WIDTH)
        .css('height', WINDOW_HEIGHT);

    var img = new Image();
    $(img)
        .load(function () { spriteSheetLoaded() })
        .attr('src', '/img/master.png');
});

function spriteSheetLoaded() {

    var masterSheet = loadAndResize('img/master.png', SCALE);

    stage = new createjs.Stage("theCanvas");
			
    var data = {
	    images: [masterSheet],
	    frames: {width:TILE_WIDTH, height:TILE_HEIGHT},
	    animations: { flower:[0,1], egg:[2,3], mouse:[4,5], hammer:[6,7],
                      teapot:[8,9], soul:[10,11], jellyfish:[12,13], duck:[14,15],
                      log:[16,17], pants:[18,19], umbrella:[20,21], monolith:[22,23],
                      glitch:[40,43] }
    };
    spriteSheet = new createjs.SpriteSheet(data);
			
    socket = io.connect();
    socket.emit('GetGame');

    socket.on('GetGame', function (serverGame) { gotGame(serverGame); });
}

function gotGame(serverGame) {

    game = serverGame;

    // draw the map
    for (var x = 0; x < WINDOW_TILE_WIDTH; x++) {
	    for (var y = 0; y < WINDOW_TILE_HEIGHT; y++) {
		    var background = new createjs.Sprite(spriteSheet);
		    background.x = x*TILE_WIDTH;
		    background.y = y*TILE_HEIGHT;
		    background.gotoAndStop(game.map[x][y]);
		    stage.addChild(background);
	    }
    }

    // add other players
    socket.on('RegisterNewPlayer', function (player) { registerNewPlayer(player); });
    for (var playerId in game.players) {
        registerNewPlayer(game.players[playerId]);
    }

    // watch for other players to move
    socket.on('MovePlayer', function (data) { handleMovePlayer(data); });
    socket.on('ChangePlayerProperty', function (data) { handleChangePlayerProperty(data); });

    // add me
    me = newPlayer();
    socket.emit('RegisterNewPlayer', me);
    registerNewPlayer(me);

    Mousetrap.bind('left', function () { pressedDirection = 'left'; }, 'keydown');
    Mousetrap.bind('right', function () { pressedDirection = 'right'; }, 'keydown');
    Mousetrap.bind('up', function () { pressedDirection = 'up'; }, 'keydown');
    Mousetrap.bind('down', function () { pressedDirection = 'down'; }, 'keydown');
    Mousetrap.bind('left', function () { if (pressedDirection === 'left') pressedDirection = 'still'; }, 'keyup');
    Mousetrap.bind('right', function () { if (pressedDirection === 'right') pressedDirection = 'still'; }, 'keyup');
    Mousetrap.bind('up', function () { if (pressedDirection === 'up') pressedDirection = 'still'; }, 'keyup');
    Mousetrap.bind('down', function () { if (pressedDirection === 'down') pressedDirection = 'still'; }, 'keyup');
    Mousetrap.bind('space', function () {
        var newFace = game.faces[Math.floor(Math.random() * game.faces.length)];
        var data = { id: me.id, property: 'face', value: newFace };
        socket.emit('ChangePlayerProperty', data);
        handleChangePlayerProperty(data);
    });

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tick);    
}

function handleMovePlayer(data) {
    var oldX = game.players[data.id].dispX;
    var oldY = game.players[data.id].dispY;

    if (oldX < data.x) {
        game.players[data.id].dispX = data.x - 2;
    } else if (oldX > data.x) {
        game.players[data.id].dispX = data.x + 2;
    } else {
        game.players[data.id].dispX = data.x;
    }

    if (oldY < data.y) {
        game.players[data.id].dispY = data.y - 2;
    } else if (oldY > data.y) {
        game.players[data.id].dispY = data.y + 2;
    } else {
        game.players[data.id].dispY = data.y;
    }

    game.players[data.id].goalX = data.x;
    game.players[data.id].goalY = data.y;
}

function handleChangePlayerProperty(data) {
    game.players[data.id][data.property] = data.value;
    if (data.property === 'face') {
        game.players[data.id].anim.gotoAndPlay(data.value);
    }
}

function registerNewPlayer(player) {
    player.anim = new createjs.Sprite(spriteSheet, player.face);
    player.anim.play();
    stage.addChild(player.anim);
    game.players[player.id] = player;
}

var lastTime = -1;
var ticksSinceLastTime = 0;
function tick(event) {
    setMyDirection();
    moveAllPlayers();
    stage.update(event);
    if ((createjs.Ticker.getTicks(false) % 3) === 0) {
        socket.emit('MovePlayer', {id:me.id, x:me.dispX, y:me.dispY});
    }

    var curTime = (new Date()).getTime();
    if (curTime - lastTime >= 1000) {
        $('#fps').html(ticksSinceLastTime.toString());
        ticksSinceLastTime = 0;
        lastTime = curTime;
    }
    ticksSinceLastTime++;
}

function setMyDirection() {
    if (pressedDirection === 'left') {
        me.goalX = me.dispX - 1;
    } else if (pressedDirection === 'right') {
        me.goalX = me.dispX + 1;
    } else if (pressedDirection === 'up') {
        me.goalY = me.dispY - 1;
    } else if (pressedDirection === 'down') {
        me.goalY = me.dispY + 1;
    }
}

function moveAllPlayers() {
    for (var playerId in game.players) {
        moveOnePlayer(game.players[playerId]);
    }
}

function moveOnePlayer(player) {

    if (player.dispX === player.goalX && player.dispY === player.goalY) {
        player.anim.framerate = 2;
    } else {
        player.anim.framerate = 4;    
    }
    
    if (player.dispX > player.goalX) {
        player.dispX -= 1;
        player.anim.scaleX = 1;
        player.anim.regX = 0;        
    } else if (player.dispX < player.goalX) {
        player.dispX += 1;
        player.anim.scaleX = -1;
        player.anim.regX = TILE_WIDTH;
    }

    if (player.dispY > player.goalY) {
        player.dispY -= 1;
    } else if (player.dispY < player.goalY) {
        player.dispY += 1;
    }

    player.anim.x = player.dispX * SCALE;
    player.anim.y = player.dispY * SCALE;
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
