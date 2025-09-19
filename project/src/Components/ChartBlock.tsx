import React, { useMemo } from 'react';
import {
  Bar, Pie, Line, Scatter, Bubble
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

import type { ChartBlock } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const bgColors = [
  'bg-sky-100',
  'bg-indigo-100',
  'bg-purple-100',
  'bg-emerald-100',
  'bg-pink-100',
  'bg-yellow-100'
];

const ChartBlock: React.FC<ChartBlock> = ({ chartType, title, data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#000'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#000' },
        grid: { color: '#ccc' }
      },
      y: {
        ticks: { color: '#000' },
        grid: { color: '#ccc' }
      }
    }
  };

  const bgColor = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex];
  }, []);

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'scatter':
        return (
          <Scatter
            data={{ datasets: [{ label: 'Scatter', data, backgroundColor: '#38bdf8' }] }}
            options={options}
          />
        );
      case 'bubble':
        return (
          <Bubble
            data={{ datasets: [{ label: 'Bubbles', data, backgroundColor: '#a78bfa' }] }}
            options={options}
          />
        );
      case 'stackedBar':
        return (
          <Bar
            data={data}
            options={{
              ...options,
              scales: {
                x: { stacked: true, ticks: { color: '#000' }, grid: { color: '#ccc' } },
                y: { stacked: true, ticks: { color: '#000' }, grid: { color: '#ccc' } }
              }
            }}
          />
        );
      case 'area':
        return (
          <Line
            data={{
              ...data,
              datasets: data.datasets.map(ds => ({
                ...ds,
                fill: true,
                backgroundColor: ds.fillColor || '#93c5fd',
                borderColor: ds.fillColor || '#93c5fd'
              }))
            }}
            options={options}
          />
        );
      default:
        return (
          <div className="text-red-400">
            Unsupported chart type: {chartType}
          </div>
        );
    }
  };

  return (
    <div className={`p-4 ${bgColor} rounded-xl border border-gray-200 shadow-sm text-black`}>
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="h-64 w-full">{renderChart()}</div>
    </div>
  );
};

export default ChartBlock;
