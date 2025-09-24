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
        backgroundColor: "#1E1E2F", // dark card background
        color: "#F5F5F5",
        borderRadius: 2,
        padding: 3,
        minWidth: 200,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.6)",
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: "#A0A0B0", textTransform: "uppercase", textAlign: "center" }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "#FFFFFF", textAlign: "center" }}
      >
        {value}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{ color: "#C0C0D0", textAlign: "center" }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default RInfoCard;
