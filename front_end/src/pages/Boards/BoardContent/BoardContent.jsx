import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import ListColumns from "./ListColumns/ListColumns";
import { sortColumn } from "~/utils/sortColumn";

const BoardContent = (props) => {
  const board = props.board;
  const [orderedColumns, setOrderedColumns] = useState([]);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(
        (item) => item._id === active.id
      );
      const newIndex = orderedColumns.findIndex((item) => item._id === over.id);
      const dndOrderColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      setOrderedColumns(dndOrderColumns);
    }
  };

  useEffect(() => {
    setOrderedColumns(sortColumn(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  return (
    <DndContext onDragEnd={handleDragEnd}>
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
        <ListColumns listColumns={orderedColumns} />
      </Box>
    </DndContext>
  );
};

export default BoardContent;
