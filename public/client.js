var canvas = document.getElementById('theCanvas');
var canvasWidth = canvas.getAttribute('width');
var canvasHeight = canvas.getAttribute('height');
var ctx = canvas.getContext("2d");

var rectWidth = 25;
var rectHeight = 25;
var xWidth = GRID_WIDTH;
var yHeight = GRID_HEIGHT;
var colors = ['#FF0000', '#00F000', '#0000FF', '#FFF000', '#000000', '#FFFFFF'];
var myColorIndex = Math.floor(Math.random() * 5);
var myX = Math.floor(Math.random() * xWidth);
var myY = Math.floor(Math.random() * yHeight);

var socket = io.connect();

// first, record our own cursor
drawRect(myX, myY, myColorIndex, true);

// ask for the grid when we first start up
socket.emit('hello');

// when we get the grid, draw it on screen
socket.on('hello', function (grid) {
    for (var x = 0; x < GRID_WIDTH; x++) {
        for (var y = 0; y < GRID_HEIGHT; y++) {
            drawRect(x, y, grid[x][y], false);
        }
    }
});

// when the server tells us to draw something, draw it
socket.on('drawRect', function (data) {
    drawRect(data.x, data.y, data.colorIndex, false);
});

function drawRect(x, y, colorIndex, doBroadcast) {
    ctx.beginPath();
    ctx.rect(x * rectWidth, y * rectHeight, rectWidth, rectHeight);
    ctx.closePath();
    ctx.fillStyle = colors[colorIndex];
    ctx.fill();
    if (doBroadcast) {
        socket.emit('drawRect', { x: myX, y: myY, colorIndex: myColorIndex });    
    }
}

function doMove(direction) {
    if (direction === 'left') {
        myX = myX - 1;
        if (myX < 0) { myX = xWidth - 1; }
    } else if (direction === 'right') {
        myX = myX + 1;
        if (myX >= xWidth) { myX = 0; }
    } else if (direction === 'up') {
        myY = myY - 1;
        if (myY < 0) { myY = yHeight - 1; }
    } else if (direction === 'down') {
        myY = myY + 1;
        if (myY >= yHeight) { myY = 0; }
    } else if (direction === 'color') {
        myColorIndex = myColorIndex + 1;
        if (myColorIndex >= colors.length) { myColorIndex = 0; }
    }
    drawRect(myX, myY, myColorIndex, true);
}

Mousetrap.bind('left', function() { doMove('left'); });
Mousetrap.bind('right', function() { doMove('right'); });
Mousetrap.bind('up', function() { doMove('up'); });
Mousetrap.bind('down', function() { doMove('down'); });
Mousetrap.bind('space', function() { doMove('color'); });

Hammer(canvas).on('swipeleft', function (event) { doMove('left'); });
Hammer(canvas).on('swiperight', function (event) { doMove('right'); });
Hammer(canvas).on('swipeup', function (event) { doMove('up'); });
Hammer(canvas).on('swipedown', function (event) { doMove('down'); });
Hammer(canvas).on('tap', function (event) { doMove('color'); });