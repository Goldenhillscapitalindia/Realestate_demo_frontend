import React from 'react';
import { motion } from 'framer-motion';

interface SuggestedQuestionsBlockProps {
  questions: string[];
  onQuestionClick?: (question: string) => void;
}

const SuggestedQuestionsBlock: React.FC<SuggestedQuestionsBlockProps> = ({ questions, onQuestionClick }) => {
  return (
    <div className="p-5 rounded-xl items-center border border-white/10 shadow bg-gradient-to-br from-[#efefef] via-[#efefef] to-[#efefef] text-white">
      <h3 className="text-lg font-semibold mb-4 text-black">Suggested Questions</h3>
      <ul className="space-y-3">
        {questions.map((q, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onQuestionClick?.(q)}
            className="cursor-pointer px-3 py-2 rounded-lg bg-[#adb2b44d] hover:bg-sky-300/40 text-black hover:text-black transition-colors duration-200"
          >
            {q}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedQuestionsBlock;
