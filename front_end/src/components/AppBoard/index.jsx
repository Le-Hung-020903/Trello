import React from "react";
import Box from "@mui/material/Box";
import ModeSelect from "~/components/ModeSelect";
const AppBoard = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.light",
        width: "100%",
        height: (theme) => theme.trelloCustom.appBarHeight,
        display: "flex",
        alignItems: "center",
      }}
    >
      <ModeSelect />
    </Box>
  );
};

export default AppBoard;
