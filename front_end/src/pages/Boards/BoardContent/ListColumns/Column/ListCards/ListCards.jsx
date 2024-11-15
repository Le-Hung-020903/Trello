import React from "react";
import Box from "@mui/material/Box";
import CardItem from "./Card/Card";

const ListCards = () => {
  return (
    <Box
      sx={{
        p: "0 5px",
        m: "0 5px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowY: "auto !important",
        overflowX: "hidden !important",
        maxHeight: (theme) =>
          `calc(${theme.trelloCustom.boardContentHeight} - 
                ${theme.spacing(5)} - 
                (${theme.trelloCustom.columnHeaderHeight} + ${
            theme.trelloCustom.columnFooterHeight
          }))`,
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ced0da",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#bfc2cf",
        },
      }}
    >
      <CardItem />
    </Box>
  );
};

export default ListCards;
