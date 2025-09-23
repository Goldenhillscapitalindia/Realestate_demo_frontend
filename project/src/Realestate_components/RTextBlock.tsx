import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

const GENAITextBlock: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Card
      sx={{
        backgroundColor: "rgba(240, 248, 255, 0.9)", // subtle pastel for readability
        borderRadius: 3,
        boxShadow: 2,
        border: "1px solid rgba(0, 0, 0, 0.05)", // soft border
        color: "#111", // better contrast
        p: 1,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ paddingBottom: "16px !important" }}>
        <Typography
          variant="body1"
          component="div"
          sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GENAITextBlock;
