// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// let clients = {};

// app.use(cors());
// app.use(express.json());

// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     const data = JSON.parse(message);
//     const { type, payload, to } = data;

//     switch (type) {
//       case "register":
//         clients[payload.id] = ws;
//         break;
//       case "offer":
//       case "answer":
//       case "candidate":
//         if (clients[to]) {
//           clients[to].send(JSON.stringify({ type, payload }));
//         }
//         break;
//     }
//   });

//   ws.on("close", () => {
//     for (let id in clients) {
//       if (clients[id] === ws) delete clients[id];
//     }
//   });
// });

// // Serve static build
// const staticPath = path.join(__dirname, "../client/dist");
// app.use(express.static(staticPath));
// app.get("*", (req, res) => res.sendFile(path.join(staticPath, "index.html")));

// server.listen(5000, () =>
//   console.log("Server running on http://localhost:5000")
// );

// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// let clients = {};

// app.use(cors());
// app.use(express.json());

// function broadcastUserList() {
//   const userList = Object.keys(clients);
//   const payload = JSON.stringify({ type: "user-list", payload: userList });
//   Object.values(clients).forEach((ws) => ws.send(payload));
// }

// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     const data = JSON.parse(message);
//     const { type, payload, to } = data;

//     switch (type) {
//       case "register":
//         clients[payload.id] = ws;
//         broadcastUserList();
//         break;

//       case "offer":
//       case "answer":
//       case "candidate":
//         if (clients[to]) {
//           clients[to].send(JSON.stringify({ type, payload }));
//         }
//         break;
//     }
//   });

//   ws.on("close", () => {
//     for (let id in clients) {
//       if (clients[id] === ws) {
//         delete clients[id];
//         break;
//       }
//     }
//     broadcastUserList();
//   });
// });

// // Serve static build files
// const staticPath = path.join(__dirname, "../client/dist");
// app.use(express.static(staticPath));
// app.get("*", (req, res) => res.sendFile(path.join(staticPath, "index.html")));

// server.listen(5000, () =>
//   console.log("Server running on http://localhost:5000")
// );

// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// let clients = {};

// app.use(cors());
// app.use(express.json());

// // WebSocket communication
// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     const data = JSON.parse(message);
//     const { type, payload, to } = data;

//     switch (type) {
//       case "register":
//         clients[payload.id] = ws;
//         broadcastUsers();
//         break;
//       case "offer":
//       case "answer":
//       case "candidate":
//         if (clients[to]) {
//           clients[to].send(JSON.stringify({ type, payload }));
//         }
//         break;
//     }
//   });

//   ws.on("close", () => {
//     for (let id in clients) {
//       if (clients[id] === ws) {
//         delete clients[id];
//         break;
//       }
//     }
//     broadcastUsers();
//   });
// });

// // Send updated user list to all connected clients
// function broadcastUsers() {
//   const ids = Object.keys(clients);
//   const message = JSON.stringify({ type: "user-list", payload: ids });
//   for (let id in clients) {
//     clients[id].send(message);
//   }
// }

// // Serve static client build
// const staticPath = path.join(__dirname, "../client/dist");
// app.use(express.static(staticPath));
// app.get("*", (req, res) => res.sendFile(path.join(staticPath, "index.html")));

// server.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};

// Broadcast user list to all connected clients
const broadcastUserList = () => {
  const userList = Object.keys(clients);
  for (let id in clients) {
    clients[id].send(JSON.stringify({ type: "userlist", payload: userList }));
  }
};

app.use(cors());
app.use(express.json());

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Handle incoming WebSocket messages
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const { type, payload, to } = data;

    switch (type) {
      case "register":
        clients[payload.id] = ws;
        console.log(`User registered: ${payload.id}`);
        broadcastUserList(); // Update user list
        break;
      case "offer":
      case "answer":
      case "candidate":
        if (clients[to]) {
          clients[to].send(JSON.stringify({ type, payload }));
        }
        break;
      case "getUserList":
        // Send the user list back to the client who requested it
        ws.send(
          JSON.stringify({ type: "userlist", payload: Object.keys(clients) })
        );
        break;
      default:
        break;
    }
  });

  // Handle WebSocket connection close
  ws.on("close", () => {
    for (let id in clients) {
      if (clients[id] === ws) delete clients[id];
    }
    console.log("User disconnected");
    broadcastUserList(); // Update user list after a disconnect
  });
});

// Serve static build (frontend)
const staticPath = path.join(__dirname, "../client/dist");
app.use(express.static(staticPath));
app.get("*", (req, res) => res.sendFile(path.join(staticPath, "index.html")));

// Start server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
