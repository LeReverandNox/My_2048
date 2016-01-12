$(document).ready(function() {

    var grid = [[2, 2, 2, 0],
    [2, 2, 0, 0],
    [2, 2, 2, 0],
    [2, 0, 0, 0]];

    var score = 0;
    var bestScore = 0;
    // var lock = false;
    var spawn = false;

    var $gridCells= $(".grid");
    var $scoreDisplay = $(".header_score");
    var $bestScoreDisplay = $(".header_best_score");

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

                var $cell = $gridCells.find(".grid_row").eq(i).find(".grid_cell").eq(j);

                if(grid[i][j] !== 0) {

                    $cell.html(grid[i][j]);
                    $cell.removeClass();
                    $cell.addClass("grid_cell");
                    $cell.addClass("tuile_" + grid[i][j]);

                    if (grid[i][j] === 2048) {

                        endGame(2048);

                    }

                } else {

                    $cell.html("");
                    $cell.removeClass();
                    $cell.addClass("grid_cell");

                }


            }

        }

        // lock = false;

        // if (!possibleMove()) {

            // endGame();

        // };

    }

    function possibleMove() {

        for(i = 0; i < 4; i++) {

            for(j = 0; j < 4; j++) {

                if((grid[i + 1] !== undefined && grid[i + 1][j] === grid[i][j]) ||
                    (grid[i - 1] !== undefined && grid[i - 1][j] === grid[i][j]) ||
                    (grid[i][j + 1] !== undefined && grid[i][j + 1] === grid[i][j]) ||
                    (grid[i][j - 1] !== undefined && grid[i][j - 1] === grid[i][j])) {
                // if ((grid[i + 1] !== undefined && grid[i + 1][j] === grid[i][j]) ||
                    // (grid[i][j + 1] !== undefined && grid[i][j + 1] === grid[i][j])) {

                    return true;

                }

            }

        }

        return false;

    }

    function beginGame() {

        // resetGrid();
        resetScore();
        startKeyboard();
        updateDisplayGrid();
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

            grid[theChoosenOne[0]][theChoosenOne[1]] = tuileValue;

            if (maybe.length === 1) {

                if (!possibleMove()) {

                    console.log("Plus de possibiliite");
                    endGame();

                };
            };

        } else if (!possibleMove()) {

            console.log("Plus de possibiliite");
            endGame();

        };

    }


    function endGame(tuile) {

            updateDisplayGrid();
        $(document).off();
        $(document).keydown(function(e) {

            if (e.which === 82) {

                e.preventDefault();
                beginGame();

            };

        });

        if (tuile === 2048) {

            alert("Vous avez gagné !");

        } else {

            alert("Vous avez perdu !");

        };

    }


    function move(direction) {
        var x, y, dontTouch = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
        // var spawn = true;
        spawn = false;

        // if (!lock) {

        //     lock = true;
            removeSpaces(direction);

            //     }
            if(direction === "up") {
                for(y = 0; y < 4; y++) {
                    for(x = 0; x < 4; x++) {
                        if(y != 3 && grid[y][x] !== 0 && dontTouch[y][x] === 0) {
                            if(grid[y + 1][x] === grid[y][x]) {
                                addScore((grid[y][x]) * 2);
                                grid[y][x] = 0;
                                grid[y + 1][x] *= 2;
                                dontTouch[y + 1][x] = 1;
                                spawn = true;
                            } /*else if(grid[y + 1][x] === 0) {
                                grid[y + 1][x] = grid[y][x];
                                grid[y][x] = 0;
                                // spawn = true;
                            }*/
                        } else {
                            // spawn = true;
                        }
                    }
                }
            }
             else if(direction === "down") {
                for(y = 3; y >= 0; y--) {
                    for(x = 0; x < 4; x++) {
                        if(y != 0 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
                            if(grid[y - 1][x] === grid[y][x]) {
                                addScore((grid[y][x]) * 2);
                                grid[y][x] =0;
                                grid[y - 1][x] *= 2;
                                dontTouch[y - 1][x] = 1;
                            } /*else if(grid[y - 1][x] ===0) {
                                grid[y - 1][x] = grid[y][x];
                                grid[y][x] = 0;
                            }*/
                        }
                    }
                }
            }
            else if(direction === "right") {
                for(x = 3; x >= 0; x--) {
                    for(y = 0; y < 4; y++) {
                        if(x !== 0 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
                            if(grid[y][x - 1] === grid[y][x]) {
                                addScore((grid[y][x]) * 2);
                                grid[y][x] = 0;
                                grid[y][x - 1] *= 2;
                                dontTouch[y][x - 1] = 1;

                            } /*else if(grid[y][x - 1] ===0) {
                                grid[y][x - 1] = grid[y][x];
                                grid[y][x] =0;
                            }*/
                        }
                    }
                }
            }
            else if(direction === "left") {
                for(x = 0; x < 4; x++) {
                    for(y = 0; y < 4; y++) {
                        if(x !== 3 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
                            if(grid[y][x + 1] === grid[y][x]) {
                                addScore((grid[y][x]) * 2);
                                grid[y][x] = 0;
                                grid[y][x + 1] *= 2;
                                dontTouch[y][x + 1] = 1;
                            } /*else if(grid[y][x + 1] ===0) {
                                grid[y][x + 1] = grid[y][x];
                                grid[y][x] = 0;
                            }*/
                        }
                    }
                }
             }
            // if(direction === "up") {
            //     for(y = 3; y >= 0; y--) {
            //         for(x = 0; x < 4; x++) {
            //             if(y != 0 && grid[y][x] !== 0 && dontTouch[y][x] === 0) {
            //                 if(grid[y - 1][x] === grid[y][x]) {
            //                     addScore((grid[y][x]) * 2);
            //                     grid[y][x] = 0;
            //                     grid[y - 1][x] *= 2;
            //                     dontTouch[y-1][x] = 1;
            //                     move = false;
            //                 } else if(grid[y - 1][x] === 0) {
            //                     grid[y - 1][x] = grid[y][x];
            //                     grid[y][x] = 0;
            //                     move = false;
            //                 }
            //             } else {
            //                 move = false;
            //             }
            //         }
            //     } else if(direction === "right") {
            //     for(x = 0; x < 4; x++) {
            //         for(y = 0; y < 4; y++) {
            //             if(x != 3 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
            //                 if(grid[y][x + 1] === grid[y][x]) {
            //                     addScore((grid[y][x]) * 2);
            //                     grid[y][x] =0;
            //                     grid[y][x + 1] *= 2;
            //                     dontTouch[y][x+1] = 1;

            //                 } else if(grid[y][x + 1] ===0) {
            //                     grid[y][x + 1] = grid[y][x];
            //                     grid[y][x] =0;
            //                 }
            //             }
            //         }
            //     }
            // } else if(direction === "left") {
            //     for(x = 3; x >= 0; x--) {
            //         for(y = 3; y >= 0; y--) {
            //             if(x != 0 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
            //                 if(grid[y][x - 1] === grid[y][x]) {
            //                     addScore((grid[y][x]) * 2);
            //                     grid[y][x] =0;
            //                     grid[y][x - 1] *= 2;
            //                     dontTouch[y][x-1] = 1;
            //                 } else if(grid[y][x - 1] ===0) {
            //                     grid[y][x - 1] = grid[y][x];
            //                     grid[y][x] =0;
            //                 }
            //             }
            //         }
            //     }
            // } else if(direction === "down") {
            //     for(y = 0; y < 4; y++) {
            //         for(x = 3; x >= 0; x--) {
            //             if(y != 3 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
            //                 if(grid[y + 1][x] === grid[y][x]) {
            //                     addScore((grid[y][x]) * 2);
            //                     grid[y][x] =0;
            //                     grid[y + 1][x] *= 2;
            //                     dontTouch[y+1][x] = 1;
            //                 } else if(grid[y + 1][x] ===0) {
            //                     grid[y + 1][x] = grid[y][x];
            //                     grid[y][x] = 0;
            //                 }
            //             }
            //         }
            //     }
            // }

            removeSpaces(direction);

            console.log(spawn);
            if (spawn) {

                generateRandom();

            };

            updateDisplayGrid();
            displayScore();

        // };

    }

    function removeSpaces(direction) {

        var x, y;
        if(direction === "up") {
            for(y = 3; y >= 0; y--) {
                for(x = 0; x < 4; x++) {
                    if(y != 0 && grid[y][x] !== 0 && grid[y - 1][x] === 0) {
                        grid[y - 1][x] = grid[y][x];
                        grid[y][x] = 0;
                        spawn = true;
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
                        spawn = true;
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
                        spawn = true;
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
                        spawn = true;
                        removeSpaces(direction);
                    }
                }
            }
        }

    }

    function addScore(nbr) {

        score += nbr;

    }

    function displayScore() {

        $scoreDisplay.html(score);

    }

    function resetScore() {

        score = 0;
        displayScore();

    }

    // Controles clavier
    function startKeyboard() {

        console.log("On lance le clavier");
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
                // console.log("On appuie sur Replay");
                beginGame();

            };

        });

    }

    $(".replay_button").on("click", function(e) {

        e.preventDefault();
        // console.log("On click sur Replay");
        beginGame();

    });


    // En route !
    beginGame();

});