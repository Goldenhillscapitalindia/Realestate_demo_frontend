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
        backgroundColor: "#173347", // card color
        color: "#FFFFFF",
        borderRadius: 3,
        padding: 3,
        minWidth: 220,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.7)", // deeper shadow for premium feel
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: "#7FA6B1", // subtle muted accent
          textTransform: "uppercase",
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#E0F7FA", // bright readable value
          textAlign: "center",
        }}
      >
        {value}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: "#A0CFE8", // softer description color
            textAlign: "center",
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default RInfoCard;
