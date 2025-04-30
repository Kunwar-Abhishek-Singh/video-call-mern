// import React, { useRef, useEffect, useState } from "react";

// Change to production URL on Render: `wss://your-render-url.onrender.com`
// const ws = new WebSocket("https://video-call-mern-w9x8.onrender.com/");

// import React, { useRef, useEffect, useState } from "react";

// // const ws = new WebSocket("wss://your-deployed-backend-url"); // Replace with your Render WebSocket URL
// const ws = new WebSocket("ws://localhost:5000");

// function App() {
//   const localVideo = useRef();
//   const remoteVideo = useRef();
//   const pc = useRef();
//   const [myId, setMyId] = useState("");
//   const [peerId, setPeerId] = useState("");
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     ws.onmessage = async (message) => {
//       const { type, payload } = JSON.parse(message.data);

//       switch (type) {
//         case "offer":
//           console.log("Received offer");
//           await createPeerConnection();
//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(payload)
//           );
//           const answer = await pc.current.createAnswer();
//           await pc.current.setLocalDescription(answer);
//           ws.send(
//             JSON.stringify({ type: "answer", payload: answer, to: peerId })
//           );
//           break;

//         case "answer":
//           console.log("Received answer");
//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(payload)
//           );
//           break;

//         case "candidate":
//           console.log("Received ICE candidate");
//           if (payload) {
//             await pc.current.addIceCandidate(new RTCIceCandidate(payload));
//           }
//           break;

//         case "user-list":
//           console.log("User list received:", payload);
//           setUsers(payload.filter((id) => id !== myId));
//           break;

//         default:
//           console.log("Unknown message type:", type);
//           break;
//       }
//     };
//   }, [peerId, myId]);

//   const createPeerConnection = async () => {
//     pc.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     pc.current.onicecandidate = (e) => {
//       if (e.candidate) {
//         ws.send(
//           JSON.stringify({
//             type: "candidate",
//             payload: e.candidate,
//             to: peerId,
//           })
//         );
//       }
//     };

//     pc.current.ontrack = (e) => {
//       remoteVideo.current.srcObject = e.streams[0];
//     };

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     localVideo.current.srcObject = stream;
//     stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));
//   };

//   const callUser = async () => {
//     if (!peerId) return alert("Enter peer ID to call");

//     await createPeerConnection();
//     const offer = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offer);
//     ws.send(JSON.stringify({ type: "offer", payload: offer, to: peerId }));
//   };

//   const register = () => {
//     if (!myId.trim()) {
//       alert("Please enter your ID before registering.");
//       return;
//     }

//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify({ type: "register", payload: { id: myId } }));
//       console.log("Registered:", myId);
//     } else {
//       ws.onopen = () => {
//         ws.send(JSON.stringify({ type: "register", payload: { id: myId } }));
//         console.log("Registered after opening:", myId);
//       };
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h2>Video Call App</h2>

//       <div>
//         <input
//           placeholder="Your ID"
//           value={myId}
//           onChange={(e) => setMyId(e.target.value)}
//         />
//         <button onClick={register}>Register</button>
//         {myId && (
//           <p>
//             ✅ Registered as: <strong>{myId}</strong>
//           </p>
//         )}
//       </div>

//       <br />

//       <div>
//         <input
//           placeholder="Peer ID to call"
//           value={peerId}
//           onChange={(e) => setPeerId(e.target.value)}
//         />
//         <button onClick={callUser}>Call</button>
//       </div>

//       <br />
//       <video
//         ref={localVideo}
//         autoPlay
//         playsInline
//         muted
//         style={{ width: "300px" }}
//       />
//       <video
//         ref={remoteVideo}
//         autoPlay
//         playsInline
//         style={{ width: "300px" }}
//       />

//       <br />
//       <h4>🟢 Online Users:</h4>
//       <ul>
//         {users.map((id) => (
//           <li key={id}>{id}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

// import React, { useRef, useEffect, useState } from "react";

// // const ws = new WebSocket("ws://localhost:5000");
// const ws = new WebSocket("https://video-call-mern-w9x8.onrender.com/");

// function App() {
//   const localVideo = useRef();
//   const remoteVideo = useRef();
//   const pc = useRef();
//   const [myId, setMyId] = useState("");
//   const [peerId, setPeerId] = useState("");
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     ws.onmessage = async (message) => {
//       const { type, payload } = JSON.parse(message.data);

//       switch (type) {
//         case "offer":
//           await createPeerConnection();
//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(payload)
//           );
//           const answer = await pc.current.createAnswer();
//           await pc.current.setLocalDescription(answer);
//           ws.send(
//             JSON.stringify({ type: "answer", payload: answer, to: peerId })
//           );
//           break;

//         case "answer":
//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(payload)
//           );
//           break;

//         case "candidate":
//           if (payload) {
//             await pc.current.addIceCandidate(new RTCIceCandidate(payload));
//           }
//           break;

//         case "user-list":
//           console.log("User list received:", payload);
//           setUsers(payload.filter((id) => id !== myId)); // exclude self
//           break;

//         default:
//           break;
//       }
//     };
//   }, [peerId, myId]);

//   const createPeerConnection = async () => {
//     pc.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     pc.current.onicecandidate = (e) => {
//       if (e.candidate) {
//         ws.send(
//           JSON.stringify({
//             type: "candidate",
//             payload: e.candidate,
//             to: peerId,
//           })
//         );
//       }
//     };

//     pc.current.ontrack = (e) => {
//       remoteVideo.current.srcObject = e.streams[0];
//     };

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localVideo.current.srcObject = stream;
//     stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));
//   };

//   const callUser = async () => {
//     await createPeerConnection();
//     const offer = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offer);
//     ws.send(JSON.stringify({ type: "offer", payload: offer, to: peerId }));
//   };

//   const register = () => {
//     if (!myId) return alert("Please enter your ID before registering.");
//     ws.send(JSON.stringify({ type: "register", payload: { id: myId } }));
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>WebRTC Video Call</h2>

//       <input
//         placeholder="Your ID"
//         value={myId}
//         onChange={(e) => setMyId(e.target.value)}
//       />
//       <button onClick={register}>Register</button>

//       <h3>Online Users:</h3>
//       <ul>
//         {users.length > 0 ? (
//           users.map((id) => (
//             <li key={id}>
//               {id}{" "}
//               <button
//                 onClick={() => {
//                   setPeerId(id);
//                   callUser();
//                 }}
//               >
//                 Call
//               </button>
//             </li>
//           ))
//         ) : (
//           <li>No other users online</li>
//         )}
//       </ul>

//       <br />

//       <video
//         ref={localVideo}
//         autoPlay
//         playsInline
//         muted
//         style={{ width: "300px", border: "1px solid black", marginRight: 10 }}
//       />
//       <video
//         ref={remoteVideo}
//         autoPlay
//         playsInline
//         style={{ width: "300px", border: "1px solid black" }}
//       />
//     </div>
//   );
// }

// export default App;

import React, { useRef, useEffect, useState } from "react";

// const ws = new WebSocket("wss://your-app-url.onrender.com"); // Update with your actual deployed URL
const ws = new WebSocket("ws://localhost:5000");

function App() {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const pc = useRef();
  const [myId, setMyId] = useState("");
  const [peerId, setPeerId] = useState("");
  const [userList, setUserList] = useState([]);

  // WebSocket message handling
  useEffect(() => {
    ws.onmessage = async (message) => {
      const { type, payload } = JSON.parse(message.data);

      switch (type) {
        case "offer":
          await createPeerConnection();
          await pc.current.setRemoteDescription(
            new RTCSessionDescription(payload)
          );
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);
          ws.send(
            JSON.stringify({ type: "answer", payload: answer, to: peerId })
          );
          break;
        case "answer":
          await pc.current.setRemoteDescription(
            new RTCSessionDescription(payload)
          );
          break;
        case "candidate":
          if (payload) {
            await pc.current.addIceCandidate(new RTCIceCandidate(payload));
          }
          break;
        case "userlist":
          setUserList(payload); // Update the user list when received from server
          break;
        default:
          break;
      }
    };
  }, [peerId]);

  const createPeerConnection = async () => {
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        ws.send(
          JSON.stringify({
            type: "candidate",
            payload: e.candidate,
            to: peerId,
          })
        );
      }
    };

    pc.current.ontrack = (e) => {
      remoteVideo.current.srcObject = e.streams[0];
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.current.srcObject = stream;
    stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));
  };

  const callUser = async () => {
    await createPeerConnection();
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: "offer", payload: offer, to: peerId }));
  };

  const register = () => {
    ws.send(JSON.stringify({ type: "register", payload: { id: myId } }));
  };

  const getUserList = () => {
    ws.send(JSON.stringify({ type: "getUserList" }));
  };

  return (
    <div>
      <h2>Video Call</h2>
      <input
        placeholder="Your ID"
        value={myId}
        onChange={(e) => setMyId(e.target.value)}
      />
      <button onClick={register}>Register</button>
      <br />
      <input
        placeholder="Peer ID"
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
      />
      <button onClick={callUser}>Call</button>
      <br />
      <button onClick={getUserList}>Refresh User List</button>

      <h3>Online Users:</h3>
      <ul>
        {userList.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>

      <video
        ref={localVideo}
        autoPlay
        playsInline
        muted
        style={{ width: "300px" }}
      />
      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        style={{ width: "300px" }}
      />
    </div>
  );
}

export default App;
