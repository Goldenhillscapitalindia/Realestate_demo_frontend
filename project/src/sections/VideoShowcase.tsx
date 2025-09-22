import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import aiVideo from '../assests/InShot_20250919_153128982.mp4';

const VideoShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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

  // Set default volume and play/pause when visible
  useEffect(() => {
    if (!videoRef.current) return;

    // Set default volume
    videoRef.current.volume = 0.9;

    if (isVisible) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

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
          {/* Video with controls */}
          <video
            ref={videoRef}
            className="w-full h-auto rounded-3xl object-cover"
            src={aiVideo}
            muted={false} // unmuted now since we have volume
            playsInline
            loop
            controls
            onEnded={() => setIsPlaying(false)}
          />

          {/* Custom Overlay Play/Pause */}
          {!isPlaying && (
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

        {/* Optional Caption */}
        <div className="text-center mt-6">
          <p className="text-lg text-gray-600">
            Experience our AI assistant in action with real-time demonstrations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
