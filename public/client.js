var canvas = document.getElementById('theCanvas');
var ctx = canvas.getContext("2d");

var colors = ['#FF0000', '#00C000', '#0000FF', '#000000',
              '#FF8000', '#FF00FF', '#00C0C0', '#808080'];
var myColor = colors[Math.floor(Math.random() * 8)];
var myX = 200;
var myY = 200;

drawRect(myX, myY, myColor);

function drawRect(x, y, color) {
    ctx.beginPath();
    ctx.rect(x, y, 10, 10);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function doMove(direction) {
    if (direction === 'left') {
        myX = myX - 10;
    } else if (direction === 'right') {
        myX = myX + 10;
    } else if (direction === 'up') {
        myY = myY - 10;
    } else if (direction === 'down') {
        myY = myY + 10;
    } else if (direction === 'color') {
        myColor = colors[Math.floor(Math.random() * 8)];
    }
    drawRect(myX, myY, myColor);
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