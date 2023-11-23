let canvas = document.querySelector("#canvas");
//re-affectation du canvas
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickColumnCount * brickRowCount) {
            alert("GG");
            document.location.reload();
            // clearInterval(interval);
          }
        }
      }
    }
  }
}

// dessin score (nb brique cassées)
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "gray";
  ctx.fillText("Score: " + score, 8, 20);
}
// dessin vie restantes
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}
// fonction dessin briques
function drawBrick() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        // calcul position pour chaque brique
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        // stockage position pour traitement collisions futures
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        // dessin briques à chaque ittération (x15 ici)
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#4e4c4e";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

let paddleHeight = 10;
let paddleWidth = 70;
let paddleX = (canvas.width - paddleWidth) / 2;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

let rightPressed = false;
let leftPressed = false;

// Récupération du context 2d pour pouvoir dessiner dans le navigateur
let ctx = canvas.getContext("2d");

// écoute évènement sur les touches left et right
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// écoute mouvement souris
document.addEventListener("mousemove", mouseMoveHandler, false);
// fonction mouvement souris
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// fonction appuis touche
function keyDownHandler(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = true;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = true;
  }
}
// fonction touche relevée
function keyUpHandler(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = false;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = false;
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#e10ffc";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  if (canvas.getContext) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(); // Callback
    drawPaddle();
    drawBrick();
    collisionDetection();
    drawScore();
    drawLives();
    // rebond haut et bas
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if (!lives) {
          // fin de partie à optimiser
          alert("loser");
          document.location.reload();
          // clearInterval(interval); // chrome
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
    // rebonds gauche et droit
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
    }
    if (rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
        // paddleX = 0;
      }
    } else if (leftPressed) {
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
        // paddleX = canvas.width - paddleWidth;
      }
    }
    x += dx; // x=x+dx
    y += dy;
  }
  requestAnimationFrame(draw); // 60fps
}

// tips chrome
// let interval = setInterval(draw, 10);
draw();
