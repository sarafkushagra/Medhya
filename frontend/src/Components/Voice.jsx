import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import medhyaLogo from "../assets/logo1.png";


export default function AIChat() {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    async function setupMic() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      source.connect(analyserRef.current);

      function updateVolume() {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const avg = dataArrayRef.current.reduce((a, b) => a + b, 0) / bufferLength;
        setVolume(avg);
        requestAnimationFrame(updateVolume);
      }
      updateVolume();
    }

    setupMic();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <motion.div
        className="rounded-full"
        animate={{
          scale: 1 + volume / 150, // pulse effect
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          width: 200,
          height: 200,
          backgroundImage: `url(${medhyaLogo})`, // Use the logo as background image
          backgroundSize: 'cover', // Ensure the image covers the div
          backgroundPosition: 'center', // Center the image
          background: "radial-gradient(circle, #ffffff, #3b82f6)", // Keep gradient as fallback or overlay if needed
        }}
      />
    {/* <img src={medhyaLogo} alt="Medhya Logo" className="absolute top-4 left-4 w-32" /> */}
    </div>
  );
}