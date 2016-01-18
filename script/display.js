$(document).ready(function() {

    // var socket = io('127.0.0.1:8080',  {query: 'clientType=display'});
    var socket = io('92.222.14.159:8080',  {query: 'clientType=display'});

    $display = $(".main_display");
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