// src/pages/RoomPage.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  // ────── STATE ──────
  const [pc, setPc] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isCaller, setIsCaller] = useState(false);          // NEW: who initiates the call

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pendingIce = useRef([]);                            // NEW: ICE queue

  // ────── SINGLETON STREAM ──────
  const streamRef = useRef(null);
  const getStream = useCallback(async () => {
    if (streamRef.current) {
      return streamRef.current;
    }
    const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = s;
    return s;
  }, []);

  // ────── CREATE PEER CONNECTION ──────
  const createPc = useCallback(
    (stream) => {
      const newPc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      // ---- add local tracks ----
      stream.getTracks().forEach((t) => newPc.addTrack(t, stream));

      // ---- remote stream ----
      newPc.ontrack = (e) => {
        const [remote] = e.streams;
        setRemoteStream(remote);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
      };

      // ---- ICE candidate ----
      newPc.onicecandidate = (e) => {
        if (e.candidate && remoteSocketId) {
          socket.emit("peer:ice-candidate", { to: remoteSocketId, candidate: e.candidate });
        }
      };

      // ---- (no onnegotiationneeded – we control it manually) ----

      setPc(newPc);
      return newPc;
    },
    [socket, remoteSocketId]
  );

  // ────── INITIALISE (stream + join room) ──────
  const init = useCallback(async () => {
    if (isReconnecting) return;
    setIsReconnecting(true);
    try {
      const stream = await getStream();
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      setMyStream(stream);
      createPc(stream);
      socket.emit("room:join", { room: roomId });
    } catch (e) {
      console.error("Init error:", e);
    } finally {
      setIsReconnecting(false);
    }
  }, [getStream, createPc, socket, roomId]);

  // ────── CALL (offer) ──────
  const callUser = useCallback(async () => {
    if (!pc || !remoteSocketId || pc.signalingState !== "stable") return;
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("user:call", { to: remoteSocketId, offer });
    } catch (e) {
      console.error("Offer error:", e);
    }
  }, [pc, remoteSocketId, socket]);

  // ────── INCOMING CALL (answer) ──────
  const answerCall = useCallback(
    async ({ from, offer }) => {
      if (!pc) return;
      setRemoteSocketId(from);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // drain queued ICE
        pendingIce.current.forEach((c) => pc.addIceCandidate(new RTCIceCandidate(c)));
        pendingIce.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("call:accepted", { to: from, ans: answer });
      } catch (e) {
        console.error("Answer error:", e);
      }
    },
    [pc, socket]
  );

  // ────── CALL ACCEPTED (set remote answer) ──────
  const onCallAccepted = useCallback(
    async ({ ans }) => {
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(ans));

        // drain queued ICE
        pendingIce.current.forEach((c) => pc.addIceCandidate(new RTCIceCandidate(c)));
        pendingIce.current = [];
      } catch (e) {
        console.error("Set answer error:", e);
      }
    },
    [pc]
  );

  // ────── ICE CANDIDATE (queue if needed) ──────
  const onIceCandidate = useCallback(
    async ({ candidate }) => {
      if (!pc) return;
      if (pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("ICE add error:", e);
        }
      } else {
        pendingIce.current.push(candidate);
      }
    },
    [pc]
  );

  // ────── NEGOTIATION (rare, but keep) ──────
  const onNegoNeeded = useCallback(
    async ({ from, offer }) => {
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("peer:nego:done", { to: from, ans: answer });
    },
    [pc, socket]
  );

  const onNegoFinal = useCallback(
    async ({ ans }) => {
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(ans));
    },
    [pc]
  );

  // ────── TOGGLES ──────
  const toggleCamera = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((t) => (t.enabled = !isCamOn));
      setIsCamOn(!isCamOn);
    }
  };
  const toggleMic = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((t) => (t.enabled = !isMicOn));
      setIsMicOn(!isMicOn);
    }
  };

  // ────── LEAVE ──────
  const leave = () => {
    if (pc) pc.close();
    socket.emit("room:leave", { room: roomId });
    navigate(`/room/${roomId}`); // stay in same room (or change to dashboard)
  };

  // ────── SOCKET LISTENERS ──────
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      init();
    };
    socket.on("connect", onConnect);

    // ---- room join response (tells us who is already there) ----
    socket.on("room:join", ({ otherUsers }) => {
      if (otherUsers.length > 0) {
        setRemoteSocketId(otherUsers[0].id);
        setIsCaller(false);               // we are the *second* user → wait for call
      } else {
        setIsCaller(true);                // we are the *first* user → will call later
      }
    });

    // ---- a new user entered → first user calls ----
    socket.on("user:joined", ({ id }) => {
      setRemoteSocketId(id);
      setIsCaller(true);
      callUser();                         // first user initiates
    });

    socket.on("incomming:call", answerCall);
    socket.on("call:accepted", onCallAccepted);
    socket.on("peer:ice-candidate", onIceCandidate);
    socket.on("peer:nego:needed", onNegoNeeded);
    socket.on("peer:nego:final", onNegoFinal);

    socket.on("user:left", () => {
      setRemoteSocketId(null);
      setRemoteStream(null);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    });

    return () => {
      socket.off();
    };
  }, [
    socket,
    init,
    callUser,
    answerCall,
    onCallAccepted,
    onIceCandidate,
    onNegoNeeded,
    onNegoFinal,
  ]);

  // ────── INITIALISE ON MOUNT ──────
  useEffect(() => {
    init();
  }, [init]);

  // ────── CLEANUP ON UNMOUNT ──────
  useEffect(() => {
    return () => {
      if (pc) pc.close();
    };
  }, [pc]);

  // ────── UI ──────
  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* VIDEO GRID */}
      {/* VIDEO GRID */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* REMOTE */}
        <div className="flex-1 relative bg-gray-900">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ display: remoteStream ? 'block' : 'none' }}
          />
          {!remoteStream && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                <p className="text-lg font-medium">Waiting for the other person…</p>
              </div>
            </div>
          )}
        </div>

        {/* LOCAL */}
        <div className="flex-1 relative bg-gray-800">
          <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {!isMicOn && (
            <div className="absolute top-4 left-4 bg-red-600 text-white rounded-full p-2">
              <MicOff className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-gray-900/95 backdrop-blur-sm p-4 flex justify-center items-center gap-6">
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full transition-all ${isMicOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-500"
            }`}
        >
          {isMicOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
        </button>

        <button
          onClick={toggleCamera}
          className={`p-4 rounded-full transition-all ${isCamOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-500"
            }`}
        >
          {isCamOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
        </button>

        <button
          onClick={leave}
          className="p-4 rounded-full bg-red-600 hover:bg-red-500 transition-all"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default RoomPage;