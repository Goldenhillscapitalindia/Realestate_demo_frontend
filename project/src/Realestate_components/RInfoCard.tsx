// InfoCard.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

export interface InfoCardProps {
  title: string;
  value: string;
  description?: string;
}

const RInfoCard: React.FC<InfoCardProps> = ({ title, value, description }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#1F2937", // dark card bg
        color: "#F9FAFB", // light text
        borderRadius: 2,
        padding: 2,
        minWidth: 200,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Typography variant="subtitle2" sx={{ color: "#9CA3AF" }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default RInfoCard;
