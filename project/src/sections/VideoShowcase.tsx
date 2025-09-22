import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import aiVideo from '../assests/InShot_20250922_144504520.mp4';

const VideoShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // New state
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Observe visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Set default volume and play/pause when visible (only if video has started)
  useEffect(() => {
    if (!videoRef.current || !hasStarted) return;
    videoRef.current.volume = 0.8;

    if (isVisible) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVisible, hasStarted]);

  const handleStart = () => {
    if (!videoRef.current) return;
    setHasStarted(true);
    videoRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <section ref={sectionRef} className="py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500">
          {/* Video */}
          <video
            ref={videoRef}
            className={`w-full h-auto rounded-3xl object-cover transition-all duration-500 ${
              !hasStarted ? 'blur-xl scale-105' : ''
            }`}
            src={aiVideo}
            muted={false}
            playsInline
            loop
            controls={hasStarted} // only show native controls after starting
            onEnded={() => setIsPlaying(false)}
          />

          {/* Initial Overlay Play Button */}
          {!hasStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <button
                onClick={handleStart}
                className="w-24 h-24 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-transform duration-300 shadow-lg"
              >
                <Play className="w-10 h-10 text-blue-700" />
              </button>
            </div>
          )}

          {/* Custom Overlay Play/Pause for playing video */}
          {hasStarted && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlay}
                className="pointer-events-auto w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-transform duration-300 shadow-lg"
              >
                <Play className="w-8 h-8 text-blue-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
