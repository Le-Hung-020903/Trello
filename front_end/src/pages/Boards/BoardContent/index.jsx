import Box from "@mui/material/Box";
import React from "react";

const BoardContent = () => {
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976D2",
        width: "100%",
        height: (theme) =>
          `calc(100vh - (${theme.trelloCustom.appBarHeight} + ${theme.trelloCustom.boardBarHeight}))`,
        display: "flex",
        alignItems: "center",
      }}
    >
      content
    </Box>
  );
};

export default BoardContent;
