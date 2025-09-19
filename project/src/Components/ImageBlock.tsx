import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

interface Props {
  title: string;
  description: string;
  url: string;
  alt: string;
}

// const BASE_URL = "http://192.168.1.40:1000"; // Your base URL
// const BASE_URL = process.env.REACT_APP_BASE_URL;
const apiUrl = import.meta.env.VITE_API_URL;


const ImageBlock: React.FC<Props> = ({ title, description, url, alt }) => {
  const fullUrl = url.startsWith("http") ? url : `${apiUrl}${url}`;

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <CardMedia component="img" height="200" image={fullUrl} alt={alt} />
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageBlock;
