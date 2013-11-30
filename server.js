var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var shared = new require('./public/shared.js');
var game = shared.newGame();

server.listen(process.env.PORT || 8080);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
app.use(express.static(__dirname + '/public'));

io.configure(function () {
  io.set('transports', ['xhr-polling']);
});

io.sockets.on('connection', function (socket) {
    socket.on('GetGame', function () {
        socket.emit('GetGame', game);
    });
    socket.on('RegisterNewPlayer', function (player) {
        socket.broadcast.emit('RegisterNewPlayer', player);
        game.players[player.id] = player;
    });
    socket.on('MovePlayer', function (data) {
        socket.broadcast.emit('MovePlayer', { id: data.id, x: data.x, y: data.y });
        game.players[data.id].dispX = data.x;
        game.players[data.id].dispY = data.y;
        game.players[data.id].goalX = data.x;
        game.players[data.id].goalY = data.y;
    });
    socket.on('ChangePlayerProperty', function (data) {
        socket.broadcast.emit('ChangePlayerProperty', data);
        (game.players[data.id])[data.property] = data.value;
    });
});
