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
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI,
} from "~/apis/index";
import { sortColumn } from "~/utils/sortColumn";
import { generatePlaceholder } from "~/utils/formatters";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";

const Board = () => {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const id = "6750779b051afc3ab70c578e";
    fetchBoardDetailsAPI(id).then(board => {
      // Sắp xếp thứ tự của column rồi mới truyền props xuống cho bên dưới map
      board.columns = sortColumn(board?.columns, board?.columnOrderIds, "_id")
    
      board.columns.forEach((column) => {
        // Cũng đồng thời kiểm tra xem trong column có card hay không
        // Nếu không có sẽ nên tạo 1 card rỗng để có thể kéo thả card được
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholder(column)];
          column.cardOrderIds = [generatePlaceholder(column)._id];
        } else {
          // Sắp xếp thứ tự cards rồi mới đưa xuosong các components con
          column.cards = sortColumn(column.cards, column.cardOrderIds, "_id");
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
      // nếu column tp update đang rỗng bản chất là chứa một placeholders card
      if (columnToUpdate.cards.some((c) => c.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        // Ngược lại column đã có data thì push vào cuối mảng
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }
    setBoard(newBoard)
  };

  // di chuyển columns trong một board 
  // thì gọi API để thay đổi state vị trí của columns
  const moveColumns =  (dndOrderColumns) => {
    const dndOrderColumnIds = dndOrderColumns.map((dndId) => dndId._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderColumns;
    newBoard.columnOrderIds = dndOrderColumnIds;
    setBoard(newBoard)
    /// Call api để fetch dữ liệu
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderColumnIds});
  };

  // khi di chuyển trong cùng 1 column
  // thì gọi API để cập nhật mảng cardOrderIds của column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheColumn = (dndOrderCards, dndOrderCardIds, columnId) => {

    // update cho chuẩn dữ liệu setState boards
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if(columnToUpdate){
      columnToUpdate.cards = dndOrderCards;
      columnToUpdate.cardOrderIds = dndOrderCardIds;
    }
    setBoard(newBoard)
    // call API để update card trong column 
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderCardIds
    });
    
  };

  // Xử lý xoá một column và card bên trong nó
  const deleteColumnDetail = (columnId) => {
    // Update chuẩn dữ liệu state board
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(id => id  !== columnId);
    setBoard(newBoard);
    // Call API đẩy lên BE
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(`${res?.deleteResult}`);
    }).catch((e) => {})
  }
  const moveCardToDifferentColumn = (
    currentCardId,
    activeColumnId,
    overColumnId,
    dndOrderColumns
  ) => {
    const dndOrderColumnIds = dndOrderColumns.map((dndId) => dndId._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderColumns;
    newBoard.columnOrderIds = dndOrderColumnIds;
    setBoard(newBoard);

    // Call API
    let preCardOrderIds = dndOrderColumns.find((c) => c._id === activeColumnId)
        ?.cardOrderIds
    
    // Xử lý vấn đề khi kéo card cuối cùng ra khỏi column
    // column rỗng sẽ cóp placeholders card
    // cần xoá nó đi trước khi gửi lên BE
    if(preCardOrderIds[0].includes("placeholder-card")) preCardOrderIds = []
    
    moveCardToDifferentColumnAPI({
      currentCardId,
      activeColumnId,
      preCardOrderIds, 
      overColumnId,
      nextCardOrderIds: dndOrderColumns.find((c) => c._id === overColumnId)
        ?.cardOrderIds,
    });
  };

  if(!board){ 
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, width: "100vw", height: "100vh" }}>
        <CircularProgress />
        <Typography>Loading Board ...</Typography>
      </Box>
    );
        console.log('🚀 ~ Board ~ res:', res)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBoard />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheColumn={moveCardInTheColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetail={deleteColumnDetail}
      />
    </Container>
  );
};

export default Board;
