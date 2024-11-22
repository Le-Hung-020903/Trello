import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep } from "lodash";
import ListColumns from "./ListColumns/ListColumns";
import { sortColumn } from "~/utils/sortColumn";
import Column from "./ListColumns/Column/Column";
import CardItem from "./ListColumns/Column/ListCards/Card/Card";

const ACTIVE_DARG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DARG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DARG_ITEM_TYPE_CARD",
};
const BoardContent = (props) => {
  const board = props.board;
  const [orderedColumns, setOrderedColumns] = useState([]);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  const findColumnCardById = (id) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card?._id)?.includes(id)
    );
  };
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const handleDragStart = (e) => {
    const { active } = e;
    setActiveDragItemId(active?.id);
    setActiveDragItemType(
      active?.data?.current?.columnId
        ? ACTIVE_DARG_ITEM_TYPE.CARD
        : ACTIVE_DARG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(active?.data?.current);
  };
  const handleDragOver = (e) => {
    const { active, over } = e;

    // Nếu kéo column sẽ không làm gì thêm
    if (activeDragItemType === ACTIVE_DARG_ITEM_TYPE.COLUMN) return;

    // Nếu không tồn tại active và over thì sẽ return luôn để tránh lỗi
    // If active and over do not exist, it will end immediately to avoid errors
    if (!active || !over) return;

    // active dragging card id: là card đang được kéo
    // over card id: là card mà mình muốn tương tác tới nó
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;

    // tìm 2 columns theo active card và over card
    const activeColumn = findColumnCardById(activeDraggingCardId);
    const overColumn = findColumnCardById(overCardId);

    // Nếu không tồn tại mội trong hai columns thì cũng sẽ return luôn
    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        // Tìm vị trí của over card trong list cards
        const overCardIndex = overColumn?.cards.findIndex(
          (card) => card?._id === overCardId
        );

        // logic tính toán cho card index mới
        let newCardIndex;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length + 1;

        // Tạo ra một orderedColumns cũ để thao tác với nó và trả về khi thao tác xong
        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns?.find(
          (c) => c?._id === activeColumn?._id
        );
        const nextOverColumn = nextColumns?.find(
          (c) => c?._id === overColumn?._id
        );

        if (nextActiveColumn) {
          // Xoá card ở cái active column (column cũ) là column lúc kéo
          nextActiveColumn.cards = nextActiveColumn?.cards?.filter(
            (card) => card._id !== activeDraggingCardId
          );

          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map(
            (c) => c?._id
          );
        }
        if (nextOverColumn) {
          // kiểm tra xem card đang kéo có ở over column chưa, nếu có thì cần xoá đi trước
          nextOverColumn.cards = nextOverColumn?.cards?.filter(
            (card) => card._id !== activeDraggingCardId
          );

          // Thêm active card đang kéo vào over column index mới
          nextOverColumn.cards = nextOverColumn?.cards?.toSpliced(
            overCardIndex,
            0,
            activeDraggingCardData
          );
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map(
            (c) => c?._id
          );
        }
        return nextColumns;
      });
    }
  };
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || !active) return;
    if (
      activeDragItemType === ACTIVE_DARG_ITEM_TYPE.CARD &&
      active.id !== over.id
    ) {
      console.log("dang keo card khong phai column");
    }
    if (
      activeDragItemType === ACTIVE_DARG_ITEM_TYPE.COLUMN &&
      active.id !== over.id
    ) {
      // Lấy vị trí cũ của column
      const oldIndex = orderedColumns.findIndex(
        (item) => item._id === active.id
      );
      // Lấy vị trí mới của column
      const newIndex = orderedColumns.findIndex((item) => item._id === over.id);
      //Dùng array move của dndkit để sắp xếp lại mảng columns ban đầu
      const dndOrderColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      setOrderedColumns(dndOrderColumns);
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  useEffect(() => {
    setOrderedColumns(sortColumn(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
      sensors={sensors}
    >
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
        <DragOverlay
          dropAnimation={{
            duration: 500,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DARG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DARG_ITEM_TYPE.CARD && (
            <CardItem cardItem={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
