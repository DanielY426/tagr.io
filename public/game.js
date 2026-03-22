const socket = io();
let otherPlayers = {};
socket.on("playersUpdate", (serverPlayers) => {
  otherPlayers = serverPlayers;
});
let gameActive = true;
let winner = null;
let walls = [];
var radius = 50;

socket.on("init", (data) => {
  walls = data.walls;
});
socket.on("GameOver", (data) => {
  gameActive = false;
  console.log("Game over! Winner:", data.winner);
});
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("Canvas size:", canvas.width, "x", canvas.height);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

let x = 50;
//Math.random() * 1920;
let y = 50;
//Math.random() * (878 - 50) + 50;

function MoveCirc() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameActive) {
    let default_move = 5;
    const prevX = x;
    const prevY = y;

    if (keys["Shift"]) {
      let sprint = 10;
      if (keys.w) y -= sprint;
      if (keys.a) x -= sprint;
      if (keys.s) y += sprint;
      if (keys.d) x += sprint;
    } else {
      if (keys.w) y -= default_move;
      if (keys.a) x -= default_move;
      if (keys.s) y += default_move;
      if (keys.d) x += default_move;
    }

    if (WallCollision(x, prevY, radius)) {
      x = prevX;
    }
    if (WallCollision(prevX, y, radius)) {
      y = prevY;
    }
  }
  socket.emit("playerMove", { x: x, y: y });

  if (x > canvas.width) x = 0;
  if (y > canvas.height) y = 0;
  if (x < 0) x = canvas.width;
  if (y < 0) y = canvas.height;

  for (let id in otherPlayers) {
    if (id !== socket.id && gameActive) {
      const other = otherPlayers[id];
      if (Collision(x, y, other.x, other.y, radius)) {
        socket.emit("playerTagged", { tagger: socket.id, tagged: id });
      }
    }
  }
  for (let wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  }
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  for (let id in otherPlayers) {
    if (id !== socket.id) {
      const player = otherPlayers[id];

      ctx.fillStyle = "#FF0000";
      ctx.beginPath();
      ctx.arc(player.x, player.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  requestAnimationFrame(MoveCirc);
}

function Collision(x1, y1, x2, y2, radius) {
  const dist_x = x2 - x1;
  const dist_y = y2 - y1;
  const distance = Math.sqrt(dist_x ** 2 + dist_y ** 2);

  return distance < radius * 2;
}

function WallCollision(x, y, radius) {
  for (let wall of walls) {
    const closestX = Math.max(wall.x, Math.min(x, wall.x + wall.width));
    const closestY = Math.max(wall.y, Math.min(y, wall.y + wall.height));

    const distanceX = x - closestX;
    const distanceY = y - closestY;
    const distanceSquared = distanceX ** 2 + distanceY ** 2;

    if (distanceSquared < radius ** 2) {
      return true;
    }
  }
  return false;
}

MoveCirc();
