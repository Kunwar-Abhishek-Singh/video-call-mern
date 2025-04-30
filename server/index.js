const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};

app.use(cors());
app.use(express.json());

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const { type, payload, to } = data;

    switch (type) {
      case "register":
        clients[payload.id] = ws;
        break;
      case "offer":
      case "answer":
      case "candidate":
        if (clients[to]) {
          clients[to].send(JSON.stringify({ type, payload }));
        }
        break;
    }
  });

  ws.on("close", () => {
    for (let id in clients) {
      if (clients[id] === ws) delete clients[id];
    }
  });
});

// Serve static build
const staticPath = path.join(__dirname, "../client/video-call-frontend/dist");
app.use(express.static(staticPath));
app.get("*", (req, res) => res.sendFile(path.join(staticPath, "index.html")));

server.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
