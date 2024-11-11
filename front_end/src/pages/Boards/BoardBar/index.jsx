import React from "react";
import Box from "@mui/material/Box";

const BoardBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        width: "100%",
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: "flex",
        alignItems: "center",
      }}
    >
      board Bar
    </Box>
  );
};

export default BoardBar;
