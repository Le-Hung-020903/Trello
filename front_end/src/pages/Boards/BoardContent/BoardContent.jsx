import React from "react";
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { sortColumn } from "~/utils/sortColumn";

const BoardContent = (props) => {
  const board = props.board;
  const sortColumns = sortColumn(board?.columns, board?.columnOrderIds, "_id");
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
      <ListColumns listColumns={sortColumns} />
    </Box>
  );
};

export default BoardContent;
