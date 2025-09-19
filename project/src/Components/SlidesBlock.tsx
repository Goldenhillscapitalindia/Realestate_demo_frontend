import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  title: string;
  content: string;
  image?: string | null;
}

interface SlidesBlockProps {
  title: string;
  slides: Slide[];
}

const cardColors = [
  'bg-gradient-to-br from-indigo-700/40 to-indigo-400/30',
  'bg-gradient-to-br from-emerald-700/40 to-emerald-400/30',
  'bg-gradient-to-br from-rose-700/40 to-rose-400/30',
  'bg-gradient-to-br from-yellow-600/40 to-yellow-400/30',
  'bg-gradient-to-br from-cyan-700/40 to-cyan-400/30',
  'bg-gradient-to-br from-purple-700/40 to-purple-400/30',
];

const SlidesBlock: React.FC<SlidesBlockProps> = ({ title, slides }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000); // auto-slide every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const bgColor = cardColors[current % cardColors.length];

  return (
    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 shadow-xl text-white relative overflow-hidden">
      <h3 className="text-2xl font-bold mb-6 text-center tracking-wide">{title}</h3>

      <div className="relative h-96 flex items-center justify-center">
     <AnimatePresence mode="wait">
  <motion.div
    key={current}
    initial={{ opacity: 0, scale: 0.95, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -30 }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
    className={`absolute w-5/6 max-w-4xl mx-auto ${bgColor} rounded-3xl p-12 shadow-2xl backdrop-blur-md`}
  >
    <h4 className="text-2xl font-bold mb-4">{slide.title}</h4>
    <p className="mb-6 text-lg leading-relaxed text-white/90">{slide.content}</p>
    {slide.image && (
      <img
        src={slide.image}
        alt={`Slide ${current + 1}`}
        className="rounded-2xl max-w-full max-h-64 object-contain mx-auto"
      />
    )}
  </motion.div>
</AnimatePresence>


        {/* Navigation buttons */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${i === current ? 'bg-white' : 'bg-white/30'}`}
            animate={{ scale: i === current ? 1.3 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <div className="text-xs text-gray-400 text-center mt-4">
        Slide {current + 1} of {slides.length}
      </div>
    </div>
  );
};

export default SlidesBlock;
