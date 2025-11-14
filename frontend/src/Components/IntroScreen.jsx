import React, { useEffect, useState } from "react";

export default function IntroScreen({ onFinish }) {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Auto-skip after 10 seconds if video doesn't work
    const autoSkipTimer = setTimeout(() => {
      onFinish();
    }, 10000);

    return () => {
      clearTimeout(autoSkipTimer);
    };
  }, [onFinish]);

  const handleVideoEnd = () => {
    onFinish();
  };

  const handleVideoError = () => {
    onFinish();
  };

  const handleVideoLoaded = () => {
    setShowLoading(false);
  };


  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Loading overlay with gradient background */}
      {showLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-10 transition-opacity duration-1000">
          <div className="text-center text-white max-w-md px-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold mb-3">Welcome to Medhya</h2>
            <p className="text-xl opacity-90 mb-4">Loading your mental health companion...</p>
            <div className="text-sm opacity-75">
              Preparing your personalized experience
            </div>
          </div>
        </div>
      )}


      {/* Responsive video element */}
      <video
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        onLoadedData={handleVideoLoaded}
        onPlaying={() => {
          setShowLoading(false);
        }}
        className="w-full h-full object-contain"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      />
    </div>
  );
}
