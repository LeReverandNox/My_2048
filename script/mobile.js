$(document).ready(function() {

    var gridToSwipe = document.getElementsByClassName('grid_holder')[0];
    var hammertime = new Hammer(gridToSwipe);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    var socket = io.connect('192.168.2.5:8080');


    socket.emit("message", "Coucou, moi je suis un mobile !");
    socket.on("message", function(e) {

        alert(e);

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

startSwipe();
})