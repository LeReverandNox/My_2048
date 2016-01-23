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
var displays = [];
var empty = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];


/* Classe Game et ses fonctions */
var Game = function() {

    this.mobileSocket;
    this.deskSocket;
    this.token;
    this.displays = [];

};
var Display = function() {
    this.ip;
    this.socket;
    this.num;
};

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

};
Game.prototype.sendToken = function() {

    io.to(this.mobileSocket).emit("token_return", this.token);

};
Game.prototype.sendTokenDisplay = function(num) {

    io.to(this.displays[num].socket).emit("token_return", this.token);

};

Game.prototype.remoteValidation = function() {

    io.to(this.deskSocket).emit("message", "Une télécommande est à présent connectée");

};
Game.prototype.displayValidation = function(num) {

    io.to(this.displays[num].socket).emit("message", "Le display No " + num + "est connecté");

};


io.sockets.on('connection', function (socket) {

    var clientType = socket.handshake.query.clientType;
    var ip = socket.handshake.address;
    var token = socket.handshake.query.token;
    var dateheure = horodatage();


    if(clientType == 'mobile') {

        if (games[token] !== undefined) {

            games[token].mobileSocket = socket.id;
            games[token].sendToken();
            games[token].remoteValidation();

            console.log("[" + dateheure[0] + " : " + dateheure[1] +  "] : Une nouvelle télécommande est connectée pour la partie " + token + " : " + ip + " !");

        } else {

            socket.emit("erreur", "Cette partie n'existe pas !");

        };

    } else if (clientType == "display") {

        if (games[token] !== undefined) {

            var index = nextIndex();
            var display = new Display();
            display.ip = ip;
            display.socket = socket.id;
            display.num = index;

            games[token].displays[index] = display;

            games[token].sendTokenDisplay(index);
            games[token].displayValidation(index);

            // On envoie la valeur d'initialisation
            socket.emit("init", (parseInt(index) + 1));

            console.log("[" + dateheure[0] + " : " + dateheure[1] +  "] : Le display " + index + " est connecté : " + ip + " !");

        } else {

            socket.emit("erreur", "Cette partie n'existe pas !");

        };

    } else {

        // Filtrage des parties par IP
        // if (ip !== "::ffff:163.5.223.65" && ip !== "::ffff:10.34.1.222" && ip !== "::ffff:127.0.0.1") {

        //     console.log(ip + " : Cette IP n'est pas authorisée à lancer une partie");
        //     return false;
        // };

        var game = new Game();

        game.deskSocket = socket.id;
        game.token = token;
        games[token] = game;

        console.log("[" + dateheure[0] + " : " + dateheure[1] +  "] : Une nouvelle partie (" + token + ") est lancée par " + ip + " !");

    }


    socket.on("disconnect", function() {
        console.log("Le display socket  : " + socket.id + " veut se deco !");

        for(var index in games) {

            var attr = games[index];
            for(var index2 in attr.displays) {

                if (attr.displays[index2].socket === socket.id) {

                empty[attr.displays[index2].num] = true;
                delete(attr.displays[index2]);

                };

            }

        }

    });



    socket.on("move", function(data) {

        games[data.token].move(data.direction);


    });

    socket.on("button", function(data) {

        games[data.token].button(data.button);

    });


    socket.on("score", function(data) {

        games[data.token].score(data.score);

    })


    socket.on("display", function(data) {

        if (games[data.token].displays[data.num] !== undefined /*&& games[token].displays.length === 16*/) {

            io.to(games[data.token].displays[data.num].socket).emit("display", data);

        } else {

            // console.log("[" + dateheure[0] + " : " + dateheure[1] +  "] : Pas assez de display connecté : " + games[token].displays.length +"/16...");

        }

    });


});

function horodatage() {

    var dateheure = [];
    var i = Math.round(new Date().getTime() / 1000);
    dateheure.push(new Date(i * 1000).toDateString());
    dateheure.push(new Date(i * 1000).toLocaleTimeString());

    return dateheure;

}

function nextIndex() {

    for(var key in empty) {

        if (empty[key] === true) {

            empty[key] = false;
            return key;

        }

    }

}

var dateheure = horodatage();
console.log("[" + dateheure[0] + " : " + dateheure[1] +  "] : Le serveur est lancé ! ");

server.listen(8080);