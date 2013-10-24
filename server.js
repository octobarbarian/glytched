var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 8080);