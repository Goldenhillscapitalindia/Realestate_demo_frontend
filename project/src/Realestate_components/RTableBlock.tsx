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

const COLOR_THEMES = [
  { headerColor: "#4FC3F7", rowHover: "rgba(79,195,247,0.1)" }, // light blue
  { headerColor: "#FFB74D", rowHover: "rgba(255,183,77,0.1)" }, // amber
  { headerColor: "#81C784", rowHover: "rgba(129,199,132,0.1)" }, // green
  { headerColor: "#BA68C8", rowHover: "rgba(186,104,200,0.1)" }, // purple
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
          bgcolor: "#1e1e1e", // dark background
          width: "100%",
          boxSizing: "border-box",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": { transform: "scale(1.01)", boxShadow: 5 },
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
                      backgroundColor:
                        i % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent", // subtle striping
                    }}
                  >
                    {row.map((cell, j) => (
                      <TableCell
                        key={j}
                        sx={{
                          fontSize: "0.875rem",
                          verticalAlign: "top",
                          wordBreak: "break-word",
                          color: "#e0e0e0", // light gray text for dark bg
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
