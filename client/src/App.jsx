import React, { useRef, useEffect, useState } from "react";

const ws = new WebSocket("ws://localhost:5000");

function App() {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const pc = useRef();
  const [myId, setMyId] = useState("");
  const [peerId, setPeerId] = useState("");

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
