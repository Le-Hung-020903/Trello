import React from "react";
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";

const BoardContent = () => {
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976D2",
        width: "100%",
        height: (theme) => theme.trelloCustom.boardContentHeight,
        display: "flex",
        overflowY: "hidden",
        overflowX: "auto",
        p: "10px 0",
      }}
    >
      <ListColumns />
    </Box>
  );
};

export default BoardContent;
