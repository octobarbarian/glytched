var canvas = document.getElementById('theCanvas');
var canvasWidth = canvas.getAttribute('width');
var canvasHeight = canvas.getAttribute('height');
var ctx = canvas.getContext("2d");

var rectWidth = 25;
var rectHeight = 25;
var colors = ['#FF0000', '#00F000', '#0000FF', '#FFF000', '#000000', '#FFFFFF'];
var myColorIndex = Math.floor(Math.random() * 5);
var myX = Math.floor(Math.random() * canvasWidth / rectWidth) * rectWidth;
var myY = Math.floor(Math.random() * canvasHeight / rectHeight) * rectHeight;

var socket = io.connect();
socket.on('drawRect', function (data) {
    drawRect(data.x, data.y, data.colorIndex, false);
});

drawRect(myX, myY, myColorIndex, true);

function drawRect(x, y, colorIndex, doBroadcast) {
    ctx.beginPath();
    ctx.rect(x, y, rectWidth, rectHeight);
    ctx.closePath();
    ctx.fillStyle = colors[colorIndex];
    ctx.fill();
    if (doBroadcast) {
        socket.emit('drawRect', { x: myX, y: myY, colorIndex: myColorIndex });    
    }
}

function doMove(direction) {
    if (direction === 'left') {
        myX = myX - rectWidth;
        if (myX < 0) { myX = canvasWidth - rectWidth; }
    } else if (direction === 'right') {
        myX = myX + rectWidth;
        if (myX >= canvasWidth) { myX = 0; }
    } else if (direction === 'up') {
        myY = myY - rectHeight;
        if (myY < 0) { myY = canvasHeight - rectHeight; }
    } else if (direction === 'down') {
        myY = myY + rectHeight;
        if (myY >= canvasHeight) { myY = 0; }
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