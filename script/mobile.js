$(document).ready(function() {

    var gridToSwipe = document.getElementsByClassName('grid_holder')[0];
    var hammertime = new Hammer(gridToSwipe);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    var undo = document.getElementsByClassName("buttons")[0].children[0];
    var reset = document.getElementsByClassName("buttons")[0].children[1];
    var undoHammer = new Hammer(undo);
    var resetHammer = new Hammer(reset);
    var socket = io.connect('92.222.14.159:8080');
    // var socket = io.connect('192.168.2.5:8080');

    console.log(undo);

    socket.on("message", function(e) {

        alert(e);

    })

    socket.on("score", function(score) {

        $(".header_score").html(score);

    })



function startSwipe() {

    hammertime.on("swipeup", function(e) {

        socket.emit("direction", "up");

    });
    hammertime.on("swipeleft", function(e) {

        socket.emit("direction", "left");

    });
    hammertime.on("swipedown", function(e) {

        socket.emit("direction", "down");

    });
    hammertime.on("swiperight", function(e) {

        socket.emit("direction", "right");

    });

}

function startButtons() {

    undoHammer.on("tap", function(e) {

        socket.emit("action", "undo");

    })

    resetHammer.on("tap", function(e) {

        socket.emit("action", "replay");

    })

}

startSwipe();
startButtons();
})