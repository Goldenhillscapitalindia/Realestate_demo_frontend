import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";

ChartJS.register(
  CategoryScale,
  LinearScale,
  MatrixController,
  MatrixElement,
  Tooltip,
  Legend
);

type RHeatmapBlockProps = {
  title: string;
  data: number[][];
  fixedHeight?: number;
};

const RHeatmapBlock: React.FC<RHeatmapBlockProps> = ({
  title,
  data,
  fixedHeight = 380,
}) => {
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
        backgroundColor(ctx: any) {
          const value = ctx.dataset.data[ctx.dataIndex].v;
          if (value < 2) return "rgba(96,165,250,0.6)"; // blue
          if (value < 5) return "rgba(34,197,94,0.6)"; // green
          return "rgba(239,68,68,0.6)"; // red
        },
        width: ({ chart }: any) =>
          chart.chartArea
            ? chart.chartArea.width / data[0].length - 2
            : 20,
        height: ({ chart }: any) =>
          chart.chartArea
            ? chart.chartArea.height / data.length - 2
            : 20,
      },
    ],
  };

  const options: any = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "linear",
        offset: true,
        ticks: { stepSize: 1 },
        min: -0.5,
        max: data[0].length - 0.5,
      },
      y: {
        type: "linear",
        offset: true,
        ticks: { stepSize: 1 },
        min: -0.5,
        max: data.length - 0.5,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `Value: ${ctx.raw.v}`,
        },
      },
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
        background: "linear-gradient(135deg, #f5f7fa, #e4ecf7)",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ color: "#2c387e", mb: 1, textAlign: "center" }}
      >
        {title}
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Chart type="matrix" data={formattedData} options={options} />
      </Box>
    </Paper>
  );
};

export default RHeatmapBlock;
