import React from "react";
import Container from "@mui/material/Container";
import AppBoard from "~/components/AppBoard";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";

const Board = () => {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBoard />
      <BoardBar />
      <BoardContent />
    </Container>
  );
};

export default Board;
