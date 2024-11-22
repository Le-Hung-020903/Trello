import React from "react";
import Box from "@mui/material/Box";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardItem from "./Card/Card";

const ListCards = (props) => {
  const listCards = props.listCards;

  return (
    <SortableContext
      items={listCards?.map((item) => item?._id)}
      strategy={verticalListSortingStrategy}
    >
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
        {listCards?.map((card) => (
          <CardItem key={card._id} cardItem={card} />
        ))}
      </Box>
    </SortableContext>
  );
};

export default ListCards;
