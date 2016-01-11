$(document).ready(function() {

    var grid = [[4, 0, 0, 4],
    [2, 2, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 2]];

    // var grid = [[8, 4, 6, 8],
    // [8, 6, 4, 2],
    // [2, 4, 6, 8],
    // [8, 6, 4, 2]];

    var gridCells= $(".grid");

    // var grid = [[1, 1, 1, 1],
    // [1, 1, 1, 1],
    // [1, 1, 1, 1],
    // [1, 1, 1, 1]];

    var score = 0;


    function resetGrid() {

        for (var i = 0; i < 4; i++) {

            for (var j = 0; j < 4; j++) {

                grid[i][j] = 0;

            };

        };

    }

    function updateDisplayGrid() {

        for(i = 0; i < 4; i++) {

            for(j = 0; j < 4; j++) {

                console.log("Line" + i + " : cell : " + j + " = " + grid[i][j]);
                var cell = gridCells.find(".grid_row").eq(i).find(".grid_cell").eq(j);

                if(grid[i][j] !== 0) {

                    cell.html(grid[i][j]);
                    cell.removeClass();
                    cell.addClass("grid_cell");
                    cell.addClass("tuile_" + grid[i][j]);

                } else {

                    cell.html("");
                    cell.removeClass();
                    cell.addClass("grid_cell");

                }

            }

        }

    }

    function possibleMove() {

        for(i = 0; i < 4; i++) {

            for(j = 0; j < 4; j++) {

                if((grid[i + 1] !== undefined && grid[i + 1][j] === grid[i][j]) || (grid[i][j + 1] !== undefined && grid[i][j + 1] === grid[i][j])) {

                    console.log("On ne peux plus spawn mais il vous reste des mouvements possible");
                    return true;

                }

            }

        }

        console.log("Game over");
        return false;

    }

    function beginGame() {

        resetGrid();
        generateRandom();
        generateRandom();
        updateDisplayGrid();

    }

    function generateRandom() {

        var maybe = [];

        for (var i = 0; i < 4; i++) {

            for (var j = 0; j < 4; j++) {

                if (grid[i][j] === 0) {

                    maybe.push([i, j]);

                };

            };

        };

        if (maybe.length !== 0) {

            var tuileValue = (Math.random() < 0.5 ? 2 : 4 );
            var theChoosenOne = maybe[Math.floor(Math.random() * maybe.length)];
            console.log("On change");

            grid[theChoosenOne[0]][theChoosenOne[1]] = tuileValue;

        } else if (!possibleMove()) {

            gameOver();

        };

    }

    function gameOver() {

        alert("Vous avez perdu !");
        $(document).off();
        $(document).keydown(function(e) {

            if (e.which === 82) {

                e.preventDefault();
                console.log("On appuie sur Replay");
                beginGame();

            };

        });

    }
    function move(direction) {
        var x, y, dontTouch = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
        var move = true;

        if(direction === "up") {
            for(y = 3; y >= 0; y--) {
                for(x = 0; x < 4; x++) {
                    if(y != 0 && grid[y][x] !== 0 && dontTouch[y][x] === 0) {
                        if(grid[y - 1][x] === grid[y][x]) {
                            // addScore(grid[y][x]);
                            grid[y][x] = 0;
                            grid[y - 1][x] *= 2;
                            dontTouch[y-1][x] = 1;
                        } else if(grid[y - 1][x] === 0) {
                            grid[y - 1][x] = grid[y][x];
                            grid[y][x] = 0;
                        }
                    }
                }
            }
        } else if(direction === "right") {
            for(x = 0; x < 4; x++) {
                for(y = 0; y < 4; y++) {
                    if(x != 3 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
                        if(grid[y][x + 1] === grid[y][x]) {
                            // addScore(grid[y][x]);
                            grid[y][x] =0;
                            grid[y][x + 1] *= 2;
                            dontTouch[y][x+1] = 1;

                        } else if(grid[y][x + 1] ===0) {
                            grid[y][x + 1] = grid[y][x];
                            grid[y][x] =0;
                        }
                    }
                }
            }
        } else if(direction === "left") {
            for(x = 3; x >= 0; x--) {
                for(y = 3; y >= 0; y--) {
                    if(x != 0 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
                        if(grid[y][x - 1] === grid[y][x]) {
                            // addScore(grid[y][x]);
                            grid[y][x] =0;
                            grid[y][x - 1] *= 2;
                            dontTouch[y][x-1] = 1;
                        } else if(grid[y][x - 1] ===0) {
                            grid[y][x - 1] = grid[y][x];
                            grid[y][x] =0;
                        }
                    }
                }
            }
        } else if(direction === "down") {
            for(y = 0; y < 4; y++) {
                for(x = 3; x >= 0; x--) {
                    if(y != 3 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
                        if(grid[y + 1][x] === grid[y][x]) {
                            // addScore(grid[y][x]);
                            grid[y][x] =0;
                            grid[y + 1][x] *= 2;
                            dontTouch[y+1][x] = 1;
                        } else if(grid[y + 1][x] ===0) {
                            grid[y + 1][x] = grid[y][x];
                            grid[y][x] = 0;
                        }
                    }
                }
            }
        }

        removeSpaces(direction);
        if (move) {

            generateRandom();

        };

        updateDisplayGrid();
        // updateDisplayGrid();
        // getScore();
    }

    function removeSpaces(direction) {

        var x, y;
        if(direction === "up") {
            for(y = 3; y >= 0; y--) {
                for(x = 0; x < 4; x++) {
                    if(y != 0 && grid[y][x] !== 0 && grid[y - 1][x] === 0) {
                        grid[y - 1][x] = grid[y][x];
                        grid[y][x] = 0;
                        removeSpaces(direction);
                    }
                }
            }
        }

        if(direction === "right") {
            for(x = 0; x < 4; x++) {
                for(y = 0; y < 4; y++) {
                    if(x != 3 && grid[y][x] !== 0 && grid[y][x+1] === 0) {
                        grid[y][x + 1] = grid[y][x];
                        grid[y][x] = 0;
                        removeSpaces(direction);
                    }
                }
            }
        }
        if(direction === "left") {
            for(x = 3; x >= 0; x--) {
                for(y = 3; y >= 0; y--) {
                    if(x != 0 && grid[y][x] !== 0 && grid[y][x - 1] === 0) {
                        grid[y][x - 1] = grid[y][x];
                        grid[y][x] = 0;
                        removeSpaces(direction);
                    }
                }
            }
        }
        if(direction === "down") {
            for(y = 0; y < 4; y++) {
                for(x = 3; x >= 0; x--) {
                    if(y != 3 && grid[y][x] !== 0 && grid[y + 1][x] === 0) {
                        grid[y + 1][x] = grid[y][x];
                        grid[y][x] = 0;
                        removeSpaces(direction);
                    }
                }
            }
        }

    }

    // Controles clavier
    $(document).keydown(function(e) {
        if (e.which === 37) {

            e.preventDefault();
            // console.log("On appuie sur Gauche");
            move("left");

        };
        if (e.which === 38) {

            e.preventDefault();
            // console.log("On appuie sur Haut");
            move("up");

        };
        if (e.which === 39) {

            e.preventDefault();
            // console.log("On appuie sur Droite");
            move("right");

        };
        if (e.which === 40) {

            e.preventDefault();
            // console.log("On appuie sur Bas");
            move("down");

        };

        if (e.which === 82) {

            e.preventDefault();
            console.log("On appuie sur Replay");
            beginGame();

        };

    });

    $(".replay_button").on("click", function(e) {

        e.preventDefault();
        console.log("On click sur Replay");
        beginGame();

    });


    // En route !
    beginGame();

});