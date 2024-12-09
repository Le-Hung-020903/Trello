import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { isEmpty } from "lodash";
import AppBoard from "~/components/AppBoard/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
// import { mockData } from "~/apis/mock-data";
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
} from "~/apis/index";
import { generatePlaceholder } from "~/utils/formatters";
const Board = () => {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const id = "6750779b051afc3ab70c578e";
    fetchBoardDetailsAPI(id).then(board => {
      // Cũng đồng thời kiểm tra xem trong column có card hay không
      // Nếu không có sẽ nên tạo 1 card rỗng để có thể kéo thả card được
      board.columns.forEach((column) => {
        if(isEmpty(column.cards)){
          column.cards = [generatePlaceholder(column)]
          column.cardOrderIds = [generatePlaceholder(column)._id]
        }
      })
      setBoard(board);
    })
  }, [])
  
  // hàm có nhiệm vụ gọi API tạo mới column và làm mới lại dữ liệu State Board
  // Sau này hãy sử dụng redux để quản lý và kiểm soát state dễ hơn
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    // khi tạo column thì chưa có card nên cần xử lý việc column bị rỗng và không kéo thả được
    createdColumn.cards = [generatePlaceholder(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholder(createdColumn)._id];
    // Cập nhật lại state board
    const newBoard = {...board }
    newBoard.columns?.push(createdColumn);
    newBoard.columnOrderIds?.push(createdColumn._id);
    setBoard(newBoard);
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    // Cập nhật lại state board
    const newBoard = { ...board };
    
    // Phải tìm ra được column chứa card để update
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if(columnToUpdate){
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBoard />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  );
};

export default Board;
