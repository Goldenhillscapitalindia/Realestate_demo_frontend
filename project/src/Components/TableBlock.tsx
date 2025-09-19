import React from 'react';
import { motion } from 'framer-motion';

interface TableBlockProps {
  headers: string[];
  rows: string[][];
  title?: string;
}

const COLOR_THEMES = [
  {
    headerColor: 'text-indigo-800',
    headerBg: 'bg-indigo-100',
    rowHover: 'hover:bg-indigo-50',
  },
  {
    headerColor: 'text-red-800',
    headerBg: 'bg-red-100',
    rowHover: 'hover:bg-red-50',
  },
  {
    headerColor: 'text-teal-800',
    headerBg: 'bg-teal-100',
    rowHover: 'hover:bg-teal-50',
  },
  {
    headerColor: 'text-purple-800',
    headerBg: 'bg-purple-100',
    rowHover: 'hover:bg-purple-50',
  },
];

const getRandomTheme = () =>
  COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];

const TableBlock: React.FC<TableBlockProps> = ({ headers, rows, title }) => {
  const theme = React.useMemo(() => getRandomTheme(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="rounded-xl border border-gray-200 shadow-sm overflow-x-auto bg-gray-50">
        {title && (
          <div className={`px-4 py-3 font-semibold ${theme.headerColor}`}>
            {title}
          </div>
        )}
        <table className="min-w-full table-auto">
          <thead>
            <tr className={`${theme.headerBg}`}>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-left text-sm font-bold ${theme.headerColor} border-b border-gray-200`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`border-t border-gray-200 ${theme.rowHover} transition-colors duration-300`}
              >
                {row.map((cell, cid) => (
                  <td key={cid} className="px-4 py-2 text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TableBlock;
