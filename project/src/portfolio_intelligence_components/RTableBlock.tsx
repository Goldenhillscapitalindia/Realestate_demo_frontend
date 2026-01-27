import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

// Light-mode color themes
const COLOR_THEMES = [
  { headerColor: "#2563eb", rowHover: "#f1f5f9" },
  { headerColor: "#ef4444", rowHover: "#f1f5f9" },
  { headerColor: "#10b981", rowHover: "#f1f5f9" },
  { headerColor: "#f59e0b", rowHover: "#f1f5f9" },
  { headerColor: "#8b5cf6", rowHover: "#f1f5f9" },
];

const getRandomTheme = () =>
  COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];

const RTableBlock: React.FC<{
  headers: string[];
  rows: string[][];
  title?: string;
}> = ({ headers, rows, title }) => {
  const theme = React.useMemo(() => getRandomTheme(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          bgcolor: "#ffffff",
          width: "100%",
          boxSizing: "border-box",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
          border: "1px solid #e5e7eb",
          "&:hover": { transform: "scale(1.01)", boxShadow: "0 16px 28px rgba(15, 23, 42, 0.16)" },
        }}
      >
        {title && (
          <CardHeader
            title={
              <Typography variant="h6" sx={{ color: theme.headerColor }}>
                {title}
              </Typography>
            }
            sx={{ pb: 0 }}
          />
        )}

        <CardContent sx={{ pt: title ? 1 : 2 }}>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table
              size="small"
              sx={{
                width: "100%",
                tableLayout: "auto",
                wordBreak: "break-word",
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: `${theme.headerColor}20` }}>
                {headers.map((h, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontWeight: "bold",
                      color: theme.headerColor,
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <ReactMarkdown>{h}</ReactMarkdown>
                  </TableCell>
                ))}
              </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.rowHover,
                        transition: "background-color 0.3s ease",
                      },
                      backgroundColor: i % 2 === 0 ? "#f8fafc" : "transparent",
                    }}
                  >
                    {row.map((cell, j) => (
                      <TableCell
                        key={j}
                        sx={{
                          fontSize: "0.875rem",
                          verticalAlign: "top",
                          wordBreak: "break-word",
                          color: "#111827",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <ReactMarkdown>{cell}</ReactMarkdown>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RTableBlock;
