const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;
const players = {};
const walls = [
  //Horizontal borders
  { x: 0, y: 0, width: 1920, height: 0 },
  /*{ x: 0, y: 103.1, width: 1920, height: 1 },
  { x: 0, y: 206.2, width: 1920, height: 1 },
  { x: 0, y: 309.3, width: 1920, height: 1 },
  { x: 0, y: 412.4, width: 1920, height: 1 },
  { x: 0, y: 515.5, width: 1920, height: 1 },
  { x: 0, y: 618.6, width: 1920, height: 1 },
  { x: 0, y: 721.7, width: 1920, height: 1 },
  { x: 0, y: 824.8, width: 1920, height: 1 },*/
  { x: 0, y: 928, width: 1920, height: 1 },
];

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log(socket.id, "has joined.");

  players[socket.id] = {
    id: socket.id,
    x: Math.random() * 1920,
    y: Math.random() * (878 - 50) + 50,
  };

  if (Object.keys(players).length === 2) {
    const ids = Object.keys(players);
    if (Math.random() < 0.5) {
      players[ids[0]].role = "tagger";
      players[ids[1]].role = "runner";
    } else {
      players[ids[0]].role = "runner";
      players[ids[1]].role = "tagger";
    }
  }

  socket.emit("init", { walls: walls });

  socket.on("playerMove", (data) => {
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;

    io.emit("playersUpdate", players);
  });

  socket.on("playerTagged", (data) => {
    console.log("Player", data.tagger, "tagged", data.tagged);
    io.emit("GameOver", { winner: data.tagger, loser: data.tagged });
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "has left.");
    delete players[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
