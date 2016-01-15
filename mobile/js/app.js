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
var games = {};


/* Classe Game et ses fonctions */
var Game = function() {

    this.mobileSocket;
    this.deskSocket;
    this.token;

}

Game.prototype.move = function(direction) {

    var dateheure = horodatage();
    console.log("[" + dateheure[0] + " : " + dateheure[1] +  "] : On envoie la direction \"" + direction + "\" à la partie " + this.token);
    io.to(this.deskSocket).emit("direction", direction);

};
Game.prototype.button = function(button) {

  var dateheure = horodatage();
  console.log("[" + dateheure[0] + " : " + dateheure[1] +  "] : On appuie sur le bouton : \"" + button + "\" pour la partie " + this.token);
  io.to(this.deskSocket).emit("button", button);

};
Game.prototype.score = function(score) {

    io.to(this.mobileSocket).emit("score", score);

}
Game.prototype.sendToken = function() {

    io.to(this.mobileSocket).emit("token_return", this.token);

}
Game.prototype.remoteValidation = function() {

    io.to(this.deskSocket).emit("message", "Une télécommande est à présent connectée");

}


// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {


 var clientType = socket.handshake.query.clientType;

 if(clientType == 'mobile') {

    var token = socket.handshake.query.token;

    if (games[token] !== undefined) {

        games[token].mobileSocket = socket.id;
        games[token].sendToken();
        games[token].remoteValidation();

    } else {

        socket.emit("erreur", "Cette partie n'éxiste pas !");

    };

} else {

    var token = socket.handshake.query.token;
    var game = new Game();

    game.deskSocket = socket.id;
    game.token = token;
    games[token] = game;
}

console.log(games);


/* Log de connection */
var dateheure = horodatage();
console.log("[" + dateheure[0] + " : " + dateheure[1] +  "] : Un client est connecté !");

socket.on("move", function(data) {

    games[data.token].move(data.direction);


});

socket.on("button", function(data) {

    games[data.token].button(data.button);

});


socket.on("score", function(data) {

    games[data.token].score(data.button);

})


});

function horodatage() {

    var dateheure = [];
    var i = Math.round(new Date().getTime() / 1000);
    dateheure.push(new Date(i * 1000).toDateString());
    dateheure.push(new Date(i * 1000).toLocaleTimeString());

    return dateheure;

}

server.listen(8080);