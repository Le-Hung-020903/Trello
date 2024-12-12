import React, { useState } from "react";
import Box from "@mui/material/Box";
import Column from "./Column/Column";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { toast } from "react-toastify";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { generatePlaceholder } from "~/utils/formatters";
import { cloneDeep } from "lodash";
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { createNewColumnAPI } from "~/apis";
import { useSelector, useDispatch } from "react-redux";
const ListColumns = (props) => {
  const listColumns = props.listColumns;
  const dispatch = useDispatch();
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const board = useSelector(selectCurrentActiveBoard);
  

  const addNewColumn = async  () => {
    if (!newColumnTitle) {
      toast.error("please enter column title");
      return;
    }
    const newColumnData = {
      title: newColumnTitle,
    };

    // Gọi API tạo mới column và làm lại dữ liệu state board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    // khi tạo column thì chưa có card nên cần xử lý việc column bị rỗng và không kéo thả được
    createdColumn.cards = [generatePlaceholder(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholder(createdColumn)._id];

    // Cập nhật lại state board
    // Đoạn này dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất cảu spead operator laf shallow copy/clone
    // nên dính ơphair rules Immutability trong redux Tookit không dùng được hàm push (sửa mảng giá trị trực tiếp), cách đơn giản nhanh gọn nhất là dùng tới
    // Deep Copy/ clone toàn bộ Board cho dễ hiểu hơn
    // const newBoard = {...board }
    const newBoard = cloneDeep(board);
    newBoard.columns?.push(createdColumn);
    newBoard.columnOrderIds?.push(createdColumn._id);
    dispatch(updateCurrentActiveBoard(newBoard));

    toggleOpenNewColumnForm();
    setNewColumnTitle("");
  }
  
  return (
    <SortableContext
      items={listColumns?.map((item) => item?._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "auto",
          "&::-webkit-scrollbar-track": { m: 2 },
        }}
      >
        {listColumns?.map((column) => (
          <Column
            column={column}
            key={column?._id}
          />
        ))}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: "white",
                width: "100%",
                justifyContent: "flex-start",
                pl: 2.5,
              }}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              id="outlined-search"
              label="Enter column title..."
              type="text"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              size="small"
              sx={{
                "& label": { color: "white" },
                "& input": { color: "white" },
                "& label.Mui-focused": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: "none",
                  border: "0.5px solid",
                  borderColor: (theme) => theme.palette.success.main,
                  "&:hover": { bgcolor: (theme) => theme.palette.success.main },
                }}
                onClick={addNewColumn}
              >
                Add Column
              </Button>
              <ClearIcon
                fontSize="small"
                sx={{
                  cursor: "pointer",
                  color: "white",
                  "&:hover": { color: (theme) => theme.palette.warning.light },
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
};

export default ListColumns;
