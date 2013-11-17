var canvas = document.getElementById('theCanvas');
var canvasWidth = canvas.getAttribute('width');
var canvasHeight = canvas.getAttribute('height');
var ctx = canvas.getContext("2d");

var rectWidth = Math.floor(canvasWidth / GRID_WIDTH);
var rectHeight = Math.floor(canvasHeight / GRID_HEIGHT);

var colors = ['#FF0000', '#00F000', '#0000FF', '#FFF000', '#000000', '#FFFFFF'];

var myX = Math.floor(Math.random() * GRID_WIDTH);
var myY = Math.floor(Math.random() * GRID_HEIGHT);
var myColorIndex = Math.floor(Math.random() * 5);
var invalidated = true;

var gridctx = document.getElementById('theGridLines').getContext("2d");
drawGridLines(gridctx);

var socket = io.connect();

// first, record our own cursor
drawRect(myX, myY, myColorIndex, true);

// ask for the grid when we first start up
socket.emit('hello');

// when we get the grid, draw it on screen
socket.on('hello', function (grid) {
    theGrid = grid;
});

// when the server tells us to draw something, draw it
socket.on('drawRect', function (data) {
    drawRect(data.x, data.y, data.colorIndex, false);
});

window.requestFrame(refreshCanvas);

function refreshCanvas(time) {
    window.requestFrame(refreshCanvas);
    if (invalidated) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawGrid();
        invalidated = false;
    }
}

function drawGrid() {
    for (var x = 0; x < GRID_WIDTH; x++) {
        for (var y = 0; y < GRID_HEIGHT; y++) {
            ctx.beginPath();
            ctx.rect(x * rectWidth, y * rectHeight, rectWidth, rectHeight);
            ctx.closePath();
            ctx.fillStyle = colors[theGrid[x][y]];
            ctx.fill();
        }
    }    
}

function drawGridLines(gridctx) {
    gridctx.beginPath();
    for (var x = 1; x < GRID_WIDTH; x++) {
        gridctx.moveTo(x * rectWidth, 0);
        gridctx.lineTo(x * rectWidth, canvasHeight);
    }
    for (var y = 1; y < GRID_HEIGHT; y++) {
        gridctx.moveTo(0, y * rectHeight);
        gridctx.lineTo(canvasWidth, y * rectHeight);
    }
    gridctx.closePath();
    gridctx.strokeStyle = 'rgba(160,160,160,0.375)';
    gridctx.stroke();
}

function drawRect(x, y, colorIndex, doBroadcast) {
    theGrid[x][y] = colorIndex;
    invalidated = true;
    if (doBroadcast) {
        socket.emit('drawRect', { x: myX, y: myY, colorIndex: myColorIndex });    
    }
}

function doMove(direction) {
    if (direction === 'left') {
        myX = myX - 1;
        if (myX < 0) { myX = GRID_WIDTH - 1; }
    } else if (direction === 'right') {
        myX = myX + 1;
        if (myX >= GRID_WIDTH) { myX = 0; }
    } else if (direction === 'up') {
        myY = myY - 1;
        if (myY < 0) { myY = GRID_HEIGHT - 1; }
    } else if (direction === 'down') {
        myY = myY + 1;
        if (myY >= GRID_HEIGHT) { myY = 0; }
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