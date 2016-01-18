$(document).ready(function() {

    var tmp_token;
    var token;
    var $promptButton = $(".prompt_button");
    var $promptToken = $(".prompt_token");
    var socket;
    $display = $(".main_display");
    $form = $(".form_token");

    $display.css({display: "none"});


    $promptButton.on("click", function(e) {

        e.preventDefault();

        tmp_token = $promptToken.val();

        // socket = io('92.222.14.159:8080',  {query: 'clientType=display&token=' + tmp_token});
        // socket = io('127.0.0.1:8080',  {query: 'clientType=display&token=' + tmp_token});
        socket = io('10.34.1.222:8080',  {query: 'clientType=display&token=' + tmp_token});

        socket.on("token_return", function(tok) {

            token = tok;
            $display.css({display: "block"});
            $form.css({display: "none"});
            console.log("On est bon");

        });

        socket.on("erreur", function(erreur) {

            alert(erreur);

        });

        socket.on("score", function(score) {

            $(".header_score").html(score);

        });

        socket.on("message", function(message) {

            alert(message);

        })

        socket.on("display", function(data) {

            $display.removeClass();
            $display.addClass("grid_cell");
            $display.addClass(data.cellClass);

            if (data.spawn) {

                $display.addClass("spawn");

            };

            if (data.merge) {

                $display.addClass("merge");

            };

            $display.html(data.cellValue);

        });

        socket.on("init", function(data) {

            $display.html(data);
            console.log(data);

        });


    });

});