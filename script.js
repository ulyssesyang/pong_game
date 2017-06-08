(function (params) {

    "use strict"

    var canvas,
        canvasContext;

    var ballX = 50,
        ballY = 100,
        ballRadius = 10,
        ballSpeedX = 10,
        ballSpeedY = 10;

    var padWidth = 10,
        padHeight = 100,
        padLeftPos = 210,
        padRightPos = 210;

    var robotSpeed = 10;

    var player1Score = 0,
        player2Score = 0;

    var winnerScore = 1;

    var showWinnerScreen = false;

    window.onload = function () {

        canvas = document.getElementById('gameCanvas');
        canvasContext = canvas.getContext('2d');

        var fps = 30;
        setInterval(updateCanvas, 1000 / fps);

        canvas.addEventListener('mousemove', function (evt) {
            var mousePos = calculateMousePos(evt);
            padLeftPos = mousePos.y - padHeight / 2;
            // padRightPos = mousePos.y - padHeight / 2;
        });

        canvas.addEventListener('mousedown', function (evt) {
            if (showWinnerScreen) {
                player1Score = 0;
                player2Score = 0;
                showWinnerScreen = false;
            }
        });

    }

    function calculateMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = evt.clientX - rect.left - root.scrollLeft;
        var mouseY = evt.clientY - rect.top - root.scrollTop;

        return {x: mouseX, y: mouseY};

    }

    function ballRest() {
        if (player1Score >= winnerScore || player2Score >= winnerScore) {
            showWinnerScreen = true;
        } else {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = -ballSpeedX;
        }
    }

    function updateCanvas() {
        updateBackground();
        if (showWinnerScreen) {
            if (player1Score > player2Score) {
                canvasContext.fillStyle = 'white';
                canvasContext.fillText('Winner is Player1', 100, 100);
            } else if (player1Score < player2Score) {
                canvasContext.fillStyle = 'white';
                canvasContext.fillText('Winner is Player2', 100, 100);
            }
            return;
        }
        drawNet();
        computerMove();
        updateLeftPad();
        updateRightPad();
        updateBall();
        updateScore();
    }

    function updateBackground() {
        drawRect('black', 0, 0, canvas.width, canvas.height);
    }

    function updateLeftPad() {
        drawRect('white', 0, padLeftPos, padWidth, padHeight);
    }

    function updateRightPad() {
        drawRect('white', canvas.width - padWidth, padRightPos, padWidth, padHeight)
    }

    function drawNet() {
        for (var i = 0; i < canvas.height; i += 40) {
            drawRect('white', canvas.width / 2 - 1, i, 2, 20);
        }
    }

    function computerMove() {
        var padRightPosCenter = padRightPos + padHeight / 2;
        if (padRightPosCenter < ballY - 35) {
            padRightPos = padRightPos + robotSpeed;
        } else if (padRightPosCenter > ballY + 35) {
            padRightPos = padRightPos - robotSpeed;
        }
    }

    function updateScore() {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText('Player1:', 100, 100);
        canvasContext.fillText(player1Score, 150, 100);

        canvasContext.fillText('Player2:', canvas.width - 150, 100);
        canvasContext.fillText(player2Score, canvas.width - 100, 100);
    }

    function updateBall() {
        ballX = ballX + ballSpeedX;
        if (ballX > canvas.width) {
            if (ballY > padRightPos && ballY < padRightPos + padHeight) {
                ballSpeedX = -ballSpeedX;
                // set penalty for hitting away from the middle of pad
                var deltaY = ballY - (padRightPos + padHeight / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player1Score++;
                ballRest();
            }

        } else if (ballX < 0) {
            if (ballY > padLeftPos && ballY < padLeftPos + padHeight) {
                ballSpeedX = -ballSpeedX;
                // set penalty for hitting away from the middle of pad
                var deltaY = ballY - (padLeftPos + padHeight / 2);
                ballSpeedY = deltaY * 0.35;

            } else {
                player2Score++;
                ballRest();
            }
        }

        ballY = ballY + ballSpeedY;
        if (ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
        } else if (ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }
        drawBall('red', ballX, ballY, ballRadius);
    }

    function drawRect(color, x, y, width, height) {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(x, y, width, height);
    }

    function drawBall(color, x, y, radius) {
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

})()