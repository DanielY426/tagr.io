# tagr.io

A real-time multiplayer tag game playable in your browser. Two players connect, roles are assigned randomly — one tags, one runs. First to make contact wins.

> Currently in active development. Core gameplay loop is functional; additional features incoming.

---

## Tech Stack

- **Node.js** — server runtime
- **Socket.io** — real-time bidirectional communication between players
- **HTML/CSS** — frontend UI and retro 8-bit visual design
- **JavaScript** — game logic and client-side rendering via Canvas API

---

## Gameplay

- 2 players per match, no more
- Roles (tagger / runner) are assigned randomly at match start
- First contact ends the game
- Desktop only — keyboard controlled (WASD to move, Shift to sprint)

---

## Running Locally

**Prerequisites:** Node.js installed

```bash
git clone https://github.com/DanielY426/tagr.io.git
cd tagr.io
npm install
node server.js
```

Then open `http://localhost:3000` in two separate browser tabs to simulate two players.

---

## Roadmap

- [ ] Win/loss screen with replay option
- [ ] Role indicator UI (know if you're the tagger or runner)
- [ ] Mobile support
- [ ] Matchmaking queue
- [ ] Custom maps / obstacles

---

## Status

Playable via hosted link (desktop only). See live demo: *coming soon*

---

*Built from scratch as a personal project to learn multiplayer game development.*
