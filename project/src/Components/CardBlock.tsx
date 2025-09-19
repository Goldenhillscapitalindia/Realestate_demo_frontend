import React, { useMemo } from 'react';
import { LucideIcon, Briefcase, DollarSign, Users, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardBlockProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
}

const icons: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  dollar: DollarSign,
  users: Users,
  chart: BarChart,
};

const COLOR_PALETTES = [
  {
    titleColor: 'text-[#C0392B]',
    subtitleColor: 'text-[#7F8C8D]',
    borderColor: '#C0392B',
    textColor: 'text-[#2C2C2C]',
  },
  {
    titleColor: 'text-[#117864]',
    subtitleColor: 'text-[#5D6D7E]',
    borderColor: '#117864',
    textColor: 'text-[#212121]',
  },
  {
    titleColor: 'text-[#B7950B]',
    subtitleColor: 'text-[#7D6608]',
    borderColor: '#B7950B',
    textColor: 'text-[#333333]',
  },
  {
    titleColor: 'text-[#1A5276]',
    subtitleColor: 'text-[#5DADE2]',
    borderColor: '#1A5276',
    textColor: 'text-[#1C2833]',
  },
  {
    titleColor: 'text-[#6C3483]',
    subtitleColor: 'text-[#A569BD]',
    borderColor: '#6C3483',
    textColor: 'text-[#2E2E2E]',
  },
];

const getRandomPalette = () =>
  COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];

const CardBlock: React.FC<CardBlockProps> = ({ title, subtitle, description, icon }) => {
  const Icon = icon && icons[icon] ? icons[icon] : Briefcase;
  const palette = useMemo(() => getRandomPalette(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      className="h-full flex"
    >
      <div
        className={`p-5 rounded-xl shadow-md border border-black/10 border-l-[6px] transition-all duration-300 flex flex-col flex-grow hover:shadow-lg`}
        style={{ borderLeftColor: palette.borderColor }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-6 h-6" style={{ color: palette.borderColor }} />
          <h3 className={`text-xl font-semibold ${palette.titleColor}`}>{title}</h3>
        </div>
        {subtitle && (
          <p className={`text-sm mb-2 ${palette.subtitleColor}`}>{subtitle}</p>
        )}
        <p className={`${palette.textColor}`}>{description}</p>
      </div>
    </motion.div>
  );
};

export default CardBlock;
