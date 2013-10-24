var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));


var server = require('http').createServer(app);
server.listen(process.env.PORT || 8080);

var io = require('socket.io');
io = io.listen(server);

io.sockets.on('connection', function (socket) {
    socket.on('drawRect', function (data) {
        console.log('Relaying drawRect message with the following data:')
        console.log(data);
        socket.broadcast.emit('drawRect', data);
    })
})

