import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';

interface LinkBlockProps {
  text: string;
  url: string;
}

const bgColors = [
  'bg-indigo-100',
  'bg-pink-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-blue-100',
  'bg-purple-100'
];

const getRandomBgColor = () => {
  const index = Math.floor(Math.random() * bgColors.length);
  return bgColors[index];
};

const LinkBlock: React.FC<LinkBlockProps> = ({ text, url }) => {
  const bgColor = React.useMemo(() => getRandomBgColor(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      className={`w-full ${bgColor} rounded-xl shadow-sm border border-black/10 transition-colors duration-300 hover:bg-indigo-200`}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 text-black hover:text-sky-600"
      >
        <LinkIcon className="w-5 h-5 text-sky-600" />
        <span className="font-medium break-words">{text || url}</span>
      </a>
    </motion.div>
  );
};

export default LinkBlock;
