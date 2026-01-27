import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";

export interface InfoCardProps {
  title: string;
  value: string;
  description?: string;
}

// Array of colors to pick from
const valueColors = ["#b39cfaff", "#76d85d", "#039aff", "#ff8503", "#ffff03", "#03ffea"];

const RInfoCard: React.FC<InfoCardProps> = ({ title, value, description }) => {
  // Pick a random color for the value text
  const valueColor = useMemo(() => {
    return valueColors[Math.floor(Math.random() * valueColors.length)];
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "#111827",
        borderRadius: 3,
        padding: 2,
        width: "100%",
        minWidth: 0,
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
        border: "1px solid #e5e7eb",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 28px rgba(15, 23, 42, 0.16)",
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: "#1f2937",
          textTransform: "uppercase",
          textAlign: "center",
          letterSpacing: 1,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: valueColor, // random color applied
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        {value}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default RInfoCard;
