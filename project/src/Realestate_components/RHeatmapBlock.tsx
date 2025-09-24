import React, { useMemo } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, Tooltip, Legend } from "chart.js";
import "chartjs-chart-matrix";

ChartJS.register(LinearScale, Tooltip, Legend);

export interface RHeatmapBlockProps {
  title: string;
  data: number[][];
  fixedHeight?: number;
}

// Predefined gradient pairs (start = low, end = high)
const gradients: Array<{ start: string; end: string }> = [
  { start: "#ffffffff", end: "#fd2525ff" }, // Viridis
  { start: "#ffffffff", end: "#fd7d02" }, // Inferno
  { start: "#ffffffff", end: "#fde925" }, // Plasma
  { start: "#ffffffff", end: "#ffff00" }, // Cividis
  { start: "#ffffffff", end: "#ff4d00" }, // Coolwarm
  { start: "#ffffffff", end: "#fdf117" }, // Magma
  { start: "#ffffffff", end: "#00ff00" }, // Green-Blue
];

const RHeatmapBlock: React.FC<RHeatmapBlockProps> = ({
  title,
  data,
  fixedHeight = 380,
}) => {
  const allValues = data.flat();
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Pick one gradient per render
  const { start: startColor, end: endColor } = useMemo(() => {
    return gradients[Math.floor(Math.random() * gradients.length)];
  }, []);

  const interpolateColor = (value: number) => {
    const ratio = (value - minValue) / (maxValue - minValue || 1);

    const parseHex = (hex: string) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];

    const [r1, g1, b1] = parseHex(startColor);
    const [r2, g2, b2] = parseHex(endColor);

    const r = Math.round(r1 + ratio * (r2 - r1));
    const g = Math.round(g1 + ratio * (g2 - g1));
    const b = Math.round(b1 + ratio * (b2 - b1));

    return `rgb(${r},${g},${b})`;
  };

  const formattedData = {
    datasets: [
      {
        label: title,
        data: data.flatMap((row, i) =>
          row.map((value, j) => ({
            x: j,
            y: i,
            v: value,
          }))
        ),
        backgroundColor: (ctx: any) => {
          const value = ctx.dataset.data[ctx.dataIndex].v;
          return interpolateColor(value);
        },
        width: ({ chart }: any) =>
          chart.chartArea ? chart.chartArea.width / data[0].length - 2 : 20,
        height: ({ chart }: any) =>
          chart.chartArea ? chart.chartArea.height / data.length - 2 : 20,
      },
    ],
  };

  const options: any = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: { type: "linear", offset: true, ticks: { stepSize: 1 }, min: -0.5, max: data[0].length - 0.5 },
      y: { type: "linear", offset: true, ticks: { stepSize: 1 }, min: -0.5, max: data.length - 0.5 },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: any) => `Value: ${ctx.raw.v}` } },
    },
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        width: "100%",
        height: fixedHeight,
        borderRadius: 3,
        background: "linear-gradient(135deg, #111827, #1f2937)",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#e5e7eb", mb: 1, textAlign: "center" }}>
        {title}
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Chart type="matrix" data={formattedData} options={options} />
      </Box>

      {/* Gradient legend */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2, px: 2 }}>
        <Typography variant="caption" sx={{ color: "#e5e7eb", mr: 1 }}>
          {minValue}
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            height: 10,
            borderRadius: 5,
            background: `linear-gradient(to right, ${startColor}, ${endColor})`,
          }}
        />
        <Typography variant="caption" sx={{ color: "#e5e7eb", ml: 1 }}>
          {maxValue}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RHeatmapBlock;
