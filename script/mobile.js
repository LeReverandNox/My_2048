$(document).ready(function() {

    var gridToSwipe = document.getElementsByClassName('grid_holder')[0];
    var hammertime = new Hammer(gridToSwipe);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    var undo = document.getElementsByClassName("buttons")[0].children[0];
    var reset = document.getElementsByClassName("buttons")[0].children[1];
    var undoHammer = new Hammer(undo);
    var resetHammer = new Hammer(reset);



    function startSwipe() {

        hammertime.on("swipeup", function(e) {

            socket.emit('move', {direction: 'up', token: token});

        });
        hammertime.on("swipeleft", function(e) {

            socket.emit('move', {direction: 'left', token: token});

        });
        hammertime.on("swipedown", function(e) {

            socket.emit('move', {direction: 'down', token: token});

        });
        hammertime.on("swiperight", function(e) {

         socket.emit('move', {direction: 'right', token: token});

     });

    }

    function startButtons() {

        undoHammer.on("tap", function(e) {

            socket.emit("button", {button: "undo", token: token});

        })

        resetHammer.on("tap", function(e) {

            socket.emit("button", {button: "replay", token: token});

        })

    }


    var token;
    var tmp_token;
    var socket ;
    var $promptButton = $(".prompt_button");
    var $promptToken = $(".prompt_token");

    $promptButton.on("click", function(e) {

        e.preventDefault();

        tmp_token = $promptToken.val();
        socket = io('10.34.1.222:8080',  {query: 'clientType=mobile&token=' + tmp_token});
        // socket = io('92.222.14.159:8080',  {query: 'clientType=mobile&token=' + tmp_token});

        socket.on("token_return", function(tok) {

            token = tok;
            alert("Vous êtes bien connecté à la partie !");

        });

        socket.on("erreur", function(erreur) {

            alert(erreur);

        });

        socket.on("score", function(score) {

            $(".header_score").html(score);

        });

        setTimeout(function() {

            if (token !== undefined) {

                startSwipe();
                startButtons();

            };

        }, 1000)

    });


})