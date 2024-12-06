import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import AppBoard from "~/components/AppBoard/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
// import { mockData } from "~/apis/mock-data";
import {fetchBoardDetailsAPI} from "~/apis/index"
const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const id = "6751783bd1a90c846aad91bb";
    fetchBoardDetailsAPI(id).then(board => {
      setBoard(board);
    })
  }, [])
    
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBoard />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
};

export default Board;
