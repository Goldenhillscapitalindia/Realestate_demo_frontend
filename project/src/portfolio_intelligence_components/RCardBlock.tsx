import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

// Light-mode color palettes
const COLOR_PALETTES = [
  {
    titleColor: "#1d4ed8",
    textColor: "#1f2937",
    subtitleColor: "#6b7280",
    borderColor: "#60a5fa",
    background: "#ffffff",
  },
  {
    titleColor: "#b91c1c",
    textColor: "#1f2937",
    subtitleColor: "#6b7280",
    borderColor: "#f87171",
    background: "#ffffff",
  },
  {
    titleColor: "#047857",
    textColor: "#1f2937",
    subtitleColor: "#6b7280",
    borderColor: "#34d399",
    background: "#ffffff",
  },
  {
    titleColor: "#b45309",
    textColor: "#1f2937",
    subtitleColor: "#6b7280",
    borderColor: "#fbbf24",
    background: "#ffffff",
  },
  {
    titleColor: "#6d28d9",
    textColor: "#1f2937",
    subtitleColor: "#6b7280",
    borderColor: "#a78bfa",
    background: "#ffffff",
  },
];

const getRandomPalette = () =>
  COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];

interface GENAICardBlockProps {
  title: string;
  subtitle: string;
  description: string;
  icon?: string;
}

const RCardBlock: React.FC<GENAICardBlockProps> = ({
  title,
  subtitle,
  description,
  icon,
}) => {
  const palette = React.useMemo(() => getRandomPalette(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      style={{ height: "100%", display: "flex" }}
    >
      <Card
        sx={{
          flexGrow: 1,
          bgcolor: palette.background,
          color: palette.textColor,
          borderRadius: 3,
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
          border: "1px solid #e5e7eb",
          borderLeft: `5px solid ${palette.borderColor}`,
          transition: "all 0.3s ease",
          display: "flex",
          flexDirection: "column",
          "&:hover": { boxShadow: "0 16px 28px rgba(15, 23, 42, 0.16)" },
        }}
      >
        <CardHeader
          titleTypographyProps={{ variant: "h6", sx: { color: palette.titleColor } }}
          subheaderTypographyProps={{ sx: { color: palette.subtitleColor } }}
          title={title}
          subheader={subtitle}
          sx={{ pb: 0 }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" component="div" sx={{ color: palette.textColor }}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RCardBlock;
