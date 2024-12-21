import React, { useEffect } from "react"
import Container from "@mui/material/Container"
import { cloneDeep } from "lodash"
import AppBoard from "~/components/AppBoard/AppBar"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from "~/apis/index"
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from "~/redux/activeBoard/activeBoardSlice"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard"
const Board = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()
  useEffect(() => {
    // const id = "6750779b051afc3ab70c578e";
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch])

  // di chuyển columns trong một board
  // thì gọi API để thay đổi state vị trí của columns
  const moveColumns = (dndOrderColumns) => {
    const dndOrderColumnIds = dndOrderColumns.map((dndId) => dndId._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderColumns
    newBoard.columnOrderIds = dndOrderColumnIds
    dispatch(updateCurrentActiveBoard(newBoard))
    /// Call api để fetch dữ liệu
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderColumnIds })
  }

  // khi di chuyển trong cùng 1 column
  // thì gọi API để cập nhật mảng cardOrderIds của column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheColumn = (dndOrderCards, dndOrderCardIds, columnId) => {
    // update cho chuẩn dữ liệu setState boards
    // Can't assing to read only property 'cards' of object
    // Trường hợp Immutability ở đây đụng tới giá trị cards đang được coi là chỉ read only (nested object - can thiệp sâu dữ liệu)
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderCards
      columnToUpdate.cardOrderIds = dndOrderCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    // call API để update card trong column
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderCardIds
    })
  }

  const moveCardToDifferentColumn = (
    currentCardId,
    activeColumnId,
    overColumnId,
    dndOrderColumns
  ) => {
    const dndOrderColumnIds = dndOrderColumns.map((dndId) => dndId._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderColumns
    newBoard.columnOrderIds = dndOrderColumnIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // Call API
    let preCardOrderIds = dndOrderColumns.find(
      (c) => c._id === activeColumnId
    )?.cardOrderIds

    // Xử lý vấn đề khi kéo card cuối cùng ra khỏi column
    // column rỗng sẽ cóp placeholders card
    // cần xoá nó đi trước khi gửi lên BE
    if (preCardOrderIds[0].includes("placeholder-card")) preCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      activeColumnId,
      preCardOrderIds,
      overColumnId,
      nextCardOrderIds: dndOrderColumns.find((c) => c._id === overColumnId)
        ?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption={"Loading Board ..."} />
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      {/* Model Active Card, check đóng mở dựa theo điều kiện có tồn tại activeCard lưu trong
          redux hay không thì mới render. Mỗi thời điểm chỉ tồn tại một cái Model Card dang Active
      */}
      <ActiveCard />

      {/* Các thanh phần còn lại của board
       */}
      <AppBoard />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheColumn={moveCardInTheColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
