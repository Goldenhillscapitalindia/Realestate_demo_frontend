import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

const RTextBlock: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: 3,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
        border: "1px solid #e5e7eb",
        color: "#111827",
        p: 2,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: "0 16px 28px rgba(15, 23, 42, 0.16)",
        },
      }}
    >
      <CardContent sx={{ paddingBottom: "16px !important" }}>
        <Typography
          variant="body1"
          component="div"
          sx={{ lineHeight: 1.6, fontSize: "0.95rem", color: "#111827" }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RTextBlock;
