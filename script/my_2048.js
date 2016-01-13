$(document).ready(function() {

    var grid = [[2, 2, 2, 2],
    [2, 2, 0, 0],
    [2, 2, 2, 0],
    [2, 0, 0, 0]];
    var undo = [];

    var score = 0;
    var bestScore = 0;
    var spawn = false;
    var end = false;

    var $mainSection = $(".main_section");
    var $gridHolder = $(".grid_holder");
    var $gridCells= $(".grid");
    var $scoreDisplay = $(".header_score");
    var $bestScoreDisplay = $(".header_best_score");
    var $twitterLink;

    function resetGrid() {

        var x, y;

        for (y = 0; y < 4; y++) {

            for (x = 0; x < 4; x++) {

                grid[y][x] = 0;

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

    }

    function possibleMove() {

        for(y = 0; y < 4; y++) {

            for(x = 0; x < 4; x++) {

                if((grid[y + 1] !== undefined && grid[y + 1][x] === grid[y][x]) ||
                    // (grid[y - 1] !== undefined && grid[y - 1][x] === grid[y][x]) ||
                    // (grid[y][x + 1] !== undefined && grid[y][x + 1] === grid[y][x]) ||
                    // (grid[y][x - 1] !== undefined && grid[y][x - 1] === grid[y][x])) {
                    (grid[y][x + 1] !== undefined && grid[y][x + 1] === grid[y][x])) {

                    return true;

            }

        }

    }

    return false;

}

function beginGame() {

    if (localStorage.getItem("Backup2048") == null) {

        resetGrid();
        resetScore();
        generateRandom();
        generateRandom();

    } else {

        grid = JSON.parse(localStorage.getItem("Backup2048"));
        score = parseInt(localStorage.getItem("BackupScore2048"));

    };

    getBestScore();

    displayBestScore();
    displayScore();
    startKeyboard();
    startClicks();
    updateDisplayGrid();

    if (!possibleMove()) {

        endGame();

    };

}

function generateRandom() {

    var x, y, maybe = [];

    for (y = 0; y < 4; y++) {

        for (x = 0; x < 4; x++) {

            if (grid[x][y] === 0) {

                maybe.push([x, y]);

            };

        };

    };

    if (maybe.length !== 0) {

        var tuileValue = (Math.random() < 0.9 ? 2 : 4 );
        var theChoosenOne = maybe[Math.floor(Math.random() * maybe.length)];

        grid[theChoosenOne[0]][theChoosenOne[1]] = tuileValue;

        if (maybe.length === 1) {

            if (!possibleMove()) {

                endGame();

            };

        };

    } else if (!possibleMove()) {

        endGame();

    };

}


function endGame(tuile) {

    updateDisplayGrid();
    $(document).off();
    $(".click_button").off();
    $(document).keydown(function(e) {

        if (e.which === 82) {

            e.preventDefault();
            replay();
        };

        if (e.which === 85) {

            e.preventDefault();
            undoIt();
        };

    });

    end = true;

    if (tuile === 2048) {

        victory();

    } else {

        gameOver();

    };

}


function move(direction) {

    var x, y, dontTouch = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    spawn = false;

    /*
    // Je parse parse une version string de ma grille pour pouvoir en faire une copie dans reférence. JS à la c**
    // Merci Ruben ! Je t'appelle Papa pendant une semaine
    */

    var oldGrid = JSON.parse(JSON.stringify(grid));
    undo.push([oldGrid, score]);

    removeSpaces(direction);

    if(direction === "up") {

        for(y = 0; y < 4; y++) {

            for(x = 0; x < 4; x++) {

                if(y != 3 && grid[y][x] !== 0 && dontTouch[y][x] === 0) {

                    if(grid[y + 1][x] === grid[y][x]) {

                        addScore((grid[y][x]) * 2);
                        grid[y][x] = 0;
                        grid[y + 1][x] *= 2;
                        dontTouch[y + 1][x] = 1;

                    }

                }

            }

        }

    } else if(direction === "down") {

        for(y = 3; y >= 0; y--) {

            for(x = 0; x < 4; x++) {

                if(y != 0 && grid[y][x] > 0 && dontTouch[y][x] === 0) {

                    if(grid[y - 1][x] === grid[y][x]) {

                        addScore((grid[y][x]) * 2);
                        grid[y][x] =0;
                        grid[y - 1][x] *= 2;
                        dontTouch[y - 1][x] = 1;
                    }

                }

            }

        }

    } else if(direction === "right") {

        for(x = 3; x >= 0; x--) {

            for(y = 0; y < 4; y++) {

                if(x !== 0 && grid[y][x] > 0 && dontTouch[y][x] === 0) {

                    if(grid[y][x - 1] === grid[y][x]) {

                        addScore((grid[y][x]) * 2);
                        grid[y][x] = 0;
                        grid[y][x - 1] *= 2;
                        dontTouch[y][x - 1] = 1;

                    }

                }

            }

        }

    } else if(direction === "left") {

        for(x = 0; x < 4; x++) {

            for(y = 0; y < 4; y++) {

                if(x !== 3 && grid[y][x] > 0 && dontTouch[y][x] === 0) {

                    if(grid[y][x + 1] === grid[y][x]) {

                        addScore((grid[y][x]) * 2);
                        grid[y][x] = 0;
                        grid[y][x + 1] *= 2;
                        dontTouch[y][x + 1] = 1;

                    }

                }

            }

        }

    }

    removeSpaces(direction);

    if (spawn) {

        generateRandom();

    }

    updateDisplayGrid();
    displayScore();
    backupGrid();
    backupScore();

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

    } else if(direction === "right") {

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

    } else if(direction === "left") {

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

    } else if(direction === "down") {

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

    if (score > bestScore) {

        setBestScore(score);

    };

    displayBestScore();
    $scoreDisplay.html(score);

}

function resetScore() {

    score = 0;
    displayScore();

}

function getBestScore() {

    if(localStorage.getItem("BestScore2048") === null) {

        bestScore = 0;

    } else {

        bestScore = localStorage.getItem("BestScore2048");

    }

}

function displayBestScore() {

    getBestScore();
    $bestScoreDisplay.html(bestScore);

}

function setBestScore(score) {

    localStorage.setItem("BestScore2048", score);

}

function backupGrid() {


    localStorage.setItem("Backup2048", JSON.stringify(grid));

}

function cleanBackupGrid() {

    localStorage.removeItem("Backup2048");

}

function backupScore() {

    cleanBackupScore();
    localStorage.setItem("BackupScore2048", JSON.stringify(score));

}

function cleanBackupScore() {

    localStorage.removeItem("BackupScore2048");

}

function replay() {

    cleanBackupGrid();
    cleanBackupScore();
    $(document).off();
    $(".click_button").off();
    cleanMessages();
    beginGame();

}

function cleanMessages() {

    $(".message").remove();
    $(".share").remove();
    $gridHolder.removeClass("gameover");
    $gridHolder.removeClass("victory");

}

function prepareTwitterLink() {

    $twitterLink = $('<a href="https://twitter.com/share" class="twitter-share-button"{count} data-text="J\'ai fait ' + score + ' points sur My_2048 ! Et toi ?" data-size="large" data-hashtags="My_2048">Tweet</a>');

    !function(d,s,id) {
        if(d.getElementById(id)) {
            d.getElementById(id).remove();
        }
        var js, fjs = d.getElementsByTagName(s)[0], p=/^http:/.test(d.location) ? 'http':'https';
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js,fjs);
    }(document, 'script', 'twitter-wjs');

}

function shareBlock() {

      // Twitter link
      $share = $("<div class='share'></div>");
      $shareText = $("<p class='share_text'>Partagez votre score !</p>")
      prepareTwitterLink();
      $shareText.appendTo($share);
      $twitterLink.appendTo($share);
      $share.appendTo($mainSection);

  }

  function victory() {

    $gridHolder.addClass("victory");
    $victoryMessage = $("<p class='message'>Félicitations !<br />Vous avez atteint 2048 !</p>");
    $victoryMessage.appendTo($mainSection);

    shareBlock();

    setTimeout(function() {

        $share.fadeIn(1000);
        $victoryMessage.fadeIn(1000);

    }, 1000);

}

function gameOver() {

    $gridHolder.addClass("gameover");
    $gameOverMessage = $("<p class='message'>Dommage, vous avez perdu !</p>");
    $gameOverMessage.appendTo($mainSection);

    shareBlock();

    setTimeout(function() {

        $share.fadeIn(1000);
        $gameOverMessage.fadeIn(1000);

    }, 1000);
}

function undoIt() {

    if (undo[0] !== undefined) {

        if (end) {

            cleanMessages();
            startKeyboard();
            startClicks();

        };

        var lastUndoGrid = undo[undo.length - 1][0];
        var lastUndoScore = undo[ undo.length -1][1];
        undo.pop();


        grid = lastUndoGrid;
        score = lastUndoScore;

        getBestScore();
        displayBestScore();
        displayScore();
        updateDisplayGrid();

    };

}

    // Controles clavier
    function startKeyboard() {

        console.log("On start le clavier");
        $(document).keydown(function(e) {

            if (e.which === 37) {

                e.preventDefault();
                move("left");

            };
            if (e.which === 38) {

                e.preventDefault();
                move("up");

            };
            if (e.which === 39) {

                e.preventDefault();
                move("right");

            };
            if (e.which === 40) {

                e.preventDefault();
                move("down");

            };

            if (e.which === 82) {

                e.preventDefault();
                replay();

            };

            if (e.which === 85) {

                e.preventDefault();
                undoIt();
            };

        });

    }

    function startClicks() {

        $(".click_button_up").on("click", function(e) {

            e.preventDefault();
            move("up");

        })
        $(".click_button_left").on("click", function(e) {

            e.preventDefault();
            move("left");

        })
        $(".click_button_down").on("click", function(e) {

            e.preventDefault();
            move("down");

        })
        $(".click_button_right").on("click", function(e) {

            e.preventDefault();
            move("right");

        })
    }

    $(".replay_button").on("click", function(e) {

        e.preventDefault();
        replay();

    });
    $(".undo_button").on("click", function(e) {
        e.preventDefault();
        undoIt();
    })


    // En route !
    beginGame();

});