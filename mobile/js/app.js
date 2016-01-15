var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {

    console.log('Un client est connecté !');
    // socket.emit("message", "Welcome Home !");


    var date = new Date(i * 1000).toLocaleDateString();
    var heure = new Date(i * 1000).toLocaleTimeString();

    socket.on("direction", function(direction) {

        console.log("[" + date + " : " + heure +  "] : On envoie la direction \"" + direction + "\" au 2048");
        socket.broadcast.emit("direction", direction);

    });

    socket.on("score", function(score) {

        socket.broadcast.emit("score", score);

    })

    socket.on("action", function(action) {

        console.log("[" + date + " : " + heure +  "] :On effectue l'action : \"" + action + "\"");
        socket.broadcast.emit("action", action);

    })

});


server.listen(8080);