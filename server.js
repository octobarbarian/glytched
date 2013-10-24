var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
app.use(express.static(__dirname + '/public'));

io.configure(function () {
  io.set('transports', ['xhr-polling']);
});

io.sockets.on('connection', function (socket) {
    socket.on('drawRect', function (data) {
        console.log('Relaying drawRect message with the following data:')
        console.log(data);
        socket.broadcast.emit('drawRect', data);
    })
})
