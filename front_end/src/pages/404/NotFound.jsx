import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import React from 'react'
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const NotFound = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/" style={{textDecoration: "none"}}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          Back to Home
        </Button>
      </Link>
    </Box>
  );
}

export default NotFound
