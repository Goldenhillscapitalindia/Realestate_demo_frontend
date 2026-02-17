import React from "react";
import { Paper, Typography, Box, Divider } from "@mui/material";
import { Pie, Bar, Line, Scatter, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ReactMarkdown from "react-markdown";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

type GENAIChartBlockProps = {
  chartType: string;
  data: any;
  title: string;
  fixedHeight?: number;
};

const RChartBlock: React.FC<GENAIChartBlockProps> = ({
  chartType,
  data,
  title,
  fixedHeight = 380,
}) => {
  const type = chartType.toLowerCase();

  const chartMap: Record<string, any> = {
    pie: Pie,
    bar: Bar,
    line: Line,
    area: Line,
    scatter: Scatter,
    bubble: Bubble,
    stackedbar: Bar,
  };

  const ChartComponent = chartMap[type];

  if (!ChartComponent) {
    return (
      <Paper
        sx={{
          p: 2,
          m: 2,
          bgcolor: "#ffffff",
          width: "100%",
          borderRadius: 2,
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography variant="body2" sx={{ color: "#b91c1c" }}>
          Unsupported chart type: <strong>{chartType}</strong>
        </Typography>
      </Paper>
    );
  }

  let formattedData = data;

  if (["scatter", "bubble"].includes(type)) {
    formattedData = {
      datasets: [
        {
          label: title,
          data,
          backgroundColor: "#60a5fa",
        },
      ],
    };
  }

const chartOptions: any = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: true, position: "bottom", labels: { color: "#111827" } },
    tooltip: { bodyColor: "#111827", titleColor: "#111827", backgroundColor: "#f8fafc" },
  },
  // Conditionally include scales only for charts that need them
  ...(type !== "pie" && type !== "doughnut"
    ? {
        scales: {
          x: { ticks: { color: "#111827" }, grid: { color: "#e2e8f0" } },
          y: { ticks: { color: "#111827" }, grid: { color: "#e2e8f0" } },
        },
      }
    : {}),
};


  if (type === "area") {
    formattedData = {
      ...data,
      datasets: data.datasets.map((ds: any) => ({
        ...ds,
        fill: true,
        backgroundColor: ds.backgroundColor || "rgba(96,165,250,0.3)",
        borderColor: ds.borderColor || "#60a5fa",
        tension: 0.3,
      })),
    };
  }

  if (type === "stackedbar") {
    chartOptions.scales = {
      x: { stacked: true, ticks: { color: "#111827" }, grid: { color: "#e2e8f0" } },
      y: { stacked: true, ticks: { color: "#111827" }, grid: { color: "#e2e8f0" } },
    };
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        width: "100%",
        height: fixedHeight,
        borderRadius: 3,
        background: "#ffffff",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ color: "#111827", mb: 1 }}
      >
        <ReactMarkdown>{title}</ReactMarkdown>
      </Typography>

      <Divider sx={{ mb: 1, borderColor: "#e5e7eb" }} />

      <Box
        sx={{
          width: "100%",
          height: `calc(${fixedHeight}px - 64px)`,
          position: "relative",
        }}
      >
        <ChartComponent data={formattedData} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default RChartBlock;
