import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import { TouchSensor, MouseSensor } from "../../../customLibraries/DndKitSensors"
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep, isEmpty } from "lodash";
import ListColumns from "./ListColumns/ListColumns";
import Column from "./ListColumns/Column/Column";
import CardItem from "./ListColumns/Column/ListCards/Card/Card";
import { generatePlaceholder } from "~/utils/formatters";

const ACTIVE_DARG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DARG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DARG_ITEM_TYPE_CARD",
};
const BoardContent = (props) => {
  const board = props.board;
  const moveColumns  = props.moveColumns;
  const moveCardInTheColumn = props.moveCardInTheColumn;
  const moveCardToDifferentColumn = props.moveCardToDifferentColumn;
  const [orderedColumns, setOrderedColumns] = useState([]);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);
  // điểm va chạm cuối cùng để xử lý thuật toán va chạm
  const lastOverId = useRef(null);

  const findColumnCardById = (id) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card?._id)?.includes(id)
    );
  };
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
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

      // nextActiveColumn: column cũ
      if (nextActiveColumn) {
        // Xoá card ở cái active column (column cũ) là column lúc kéo
        nextActiveColumn.cards = nextActiveColumn?.cards?.filter(
          (card) => card._id !== activeDraggingCardId
        );
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholder(nextActiveColumn)];
        }

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map(
          (c) => c?._id
        );
      }

      // nextOverColumn: column mới
      if (nextOverColumn) {
        // kiểm tra xem card đang kéo có ở over column chưa, nếu có thì cần xoá đi trước
        nextOverColumn.cards = nextOverColumn?.cards?.filter(
          (card) => card._id !== activeDraggingCardId
        );
        // Thêm active card đang kéo vào over column index mới
        nextOverColumn.cards = nextOverColumn?.cards?.toSpliced(
          overCardIndex,
          0,
          { ...activeDraggingCardData, columnId: nextOverColumn._id }
        );
        // xoá placeholder card đi nếu tồn tại
        nextOverColumn.cards = nextOverColumn?.cards?.filter(
          (card) => !card?.FE_PlaceholderCard
        );
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map((c) => c?._id);
      }

      // Nếu là hàm handleDragEnd thì gọi API để xử lý
      // cho việc kéo thả card giữa hai column khác nhau
      // và có nghĩa gọi từ handleDragEnd thì sẽ là kéo thả xong
      if (triggerFrom === "handleDragEnd") {
        // CALL API move card to different column
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        );
      }
      return nextColumns;
    });
  };
  // custom thuật toán phát hiện va chạm
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DARG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      // tìm các điểm giao nhau, va chạm - intersections với con trỏ
      const pointerIntersections = pointerWithin(args);
      if (!pointerIntersections?.length) return;

      // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
      // const intersections =
      //   pointerIntersections.length > 0
      //     ? pointerIntersections
      //     : rectIntersection(args);

      // Tìm over id đầu tiên trong đám intersections ở trên
      let overId = getFirstCollision(pointerIntersections, "id");
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          // console.log("overId before: ", overId);
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }
        lastOverId.current = overId;
        return [{ id: overId }];
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType]
  );
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
    if (active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnCardById(active?.id));
    }
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        "handleDragOver"
      );
    }
  };
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || !active) return;

    if (
      activeDragItemType === ACTIVE_DARG_ITEM_TYPE.CARD
    ) {
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

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // HÀNH ĐỘNG KÉO THẢ CARD GIỮA HAI COLUMN KHÁC NHAU

        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        ); 
      } else {
        // HÀNH ĐỘNG KÉO THẢ CARD TRONG CÙNG COLUMN

        // Lấy vị trí cũ của card (oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (item) => item._id === activeDragItemId
        );
        // Lấy vị trí mới của card từ over
        const newCardIndex = overColumn?.cards?.findIndex(
          (item) => item._id === overCardId
        );
        // Dùng array move của dndkit để sắp xếp lại mảng cards ban đầu (cũng tương tự khi kéo column)
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        
        // Lấy ids của các card đã được kéo
        const dndOrderCardIds = dndOrderedCards.map((card) => card._id);

        setOrderedColumns(preColumn => {
          // clone mảng orderedColumn state cũ ra một cái mới để sử lý data rồi trả về
          // để cập nhật lại
          let nextColumns = cloneDeep(preColumn);

          // tìm tới column đang kéo thả (chính là column đang chứa card)
          let targetColumn = nextColumns?.find(
            (column) => column?._id === overColumn._id
          );

          // cập nhật lại 2 value mới là card và cardOrderedIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderCardIds;
          return nextColumns;
        });
        
        // Gọi API để thay đổi vị trí cards trong cùng một column
        moveCardInTheColumn(dndOrderedCards, dndOrderCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    if (
      activeDragItemType === ACTIVE_DARG_ITEM_TYPE.COLUMN &&
      active.id !== over.id
    ) {
      // Lấy vị trí cũ của column
      const oldColumnIndex = orderedColumns.findIndex(
        (item) => item._id === active.id
      );
      // Lấy vị trí mới của column
      const newColumnIndex = orderedColumns.findIndex(
        (item) => item._id === over.id
      );
      //Dùng array move của dndkit để sắp xếp lại mảng columns ban đầu
      const dndOrderColumns = arrayMove(
        orderedColumns,
        oldColumnIndex,
        newColumnIndex
      );
      // xét lại state vị trí của columns
      setOrderedColumns(dndOrderColumns);
      // Gọi Api để lưu lại vị trí của các columns
      moveColumns(dndOrderColumns)
    }

    // sau khi kéo thả xong luôn luôn trả về giá trị null ban đầu
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  useEffect(() => {
    setOrderedColumns(board.columns);
  }, [board]);
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
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
        <ListColumns
          listColumns={orderedColumns}
        />
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