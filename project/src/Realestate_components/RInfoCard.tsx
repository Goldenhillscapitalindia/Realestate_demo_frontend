import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";

export interface InfoCardProps {
  title: string;
  value: string;
  description?: string;
}

// Array of colors to pick from
const valueColors = ["#B75BCF", "#76D85D", "#039AFF", "#FF03AB", "#FFFF03", "#FF4203"];

const RInfoCard: React.FC<InfoCardProps> = ({ title, value, description }) => {
  // Pick a random color for the value text
  const valueColor = useMemo(() => {
    return valueColors[Math.floor(Math.random() * valueColors.length)];
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#173347",
        color: "#FFFFFF",
        borderRadius: 3,
        padding: 3,
        minWidth: 220,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.7)",
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
          color: "#ffffffff",
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
          color: valueColor, // random color applied
          textAlign: "center",
        }}
      >
        {value}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          sx={{
            color: "#c5e2f1ff",
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
