import React, { useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudIcon from "@mui/icons-material/Cloud";
import AddCardIcon from "@mui/icons-material/AddCard";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ListCards from "./ListCards/ListCards";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import { createNewCardAPI, deleteColumnDetailsAPI } from "~/apis";
import { cloneDeep } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";

const Column = (props) => {
  const column = props.column;
  const [anchorEl, setAnchorEl] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const confirmDeleteColumn = useConfirm();
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column?._id, data: { ...column } });

  const dndKitColumnStyle = {
    // touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const orderedCard = column?.cards;
  
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error("please enter Card title!", { position: "bottom-right" });
      return;
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column?._id,
    };
    // Gọi API tạo mới card và làm lại dữ liệu state board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    // Cập nhật lại state board
    // const newBoard = { ...board };
    const newBoard = cloneDeep(board);

    // Phải tìm ra được column chứa card để update
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );
    if (columnToUpdate) {
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
    dispatch(updateCurrentActiveBoard(newBoard));

    toggleOpenNewCardForm();
    setNewCardTitle("");
  };

  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: "Delete Column?",
      description: "This action will premanently delete your Column and its Cards! Are you sure?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",
      // dialogProps: { maxWidth:"xs" },
      // confirmationButtonProps: {color: "warning", variant: "outlined"},
      // cancellationButtonProps: {color: "inherit"},
      // allowClose: false,

      // biến phía dưới có nghĩa là phải nhập chữ ledinhung thì mới undisable nút confirm để xoá
      // confirmationKeyword: "ledinhhung"
      buttonOrder: ["confirm", "cancel"]
    }).then(() => {
        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.filter(
          (c) => c._id !== column?._id
        );
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
          (id) => id !== column?._id
        );
        dispatch(updateCurrentActiveBoard(newBoard));
        // Call API đẩy lên BE
        deleteColumnDetailsAPI(column?._id)
          .then((res) => {
            toast.success(`${res?.deleteResult}`);
          })
          .catch((e) => {});
    }).catch(() => {})
  };
  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          minWidth: "300px",
          maxWidth: "300px",
          ml: 2,
          borderRadius: "6px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(
              5
            )})`,
        }}
      >
        {/* header column */}
        <Box
          sx={{
            height: (theme) => theme.trelloCustom.columnHeaderHeight,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: "bold", cursor: "pointer" }}>
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                  color: "text.primary",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                sx={{
                  "&:hover": {
                    color: "success.light",
                    "& .addCardIcon": {
                      color: "success.light",
                    },
                  },
                }}
                onClick={toggleOpenNewCardForm}
              >
                <ListItemIcon>
                  <AddCardIcon className="addCardIcon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                  sx={{
                    "&:hover": {
                      color: "warning.dark",
                      "& .deleteForeverIcon": {
                        color: "warning.dark",
                      },
                    },
                  }}
                >
                <ListItemIcon>
                  <DeleteForeverIcon
                    className="deleteForeverIcon"
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <CloudIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* list column */}

        <ListCards listCards={orderedCard} />

        {/* footer column */}
        <Box
          sx={{
            height: (theme) => theme.trelloCustom.columnFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={toggleOpenNewCardForm}
            >
              <Button startIcon={<AddCardIcon />}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <TextField
                id="outlined-search"
                label="Enter card title..."
                type="text"
                variant="outlined"
                data-no-dnd="true"
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                size="small"
                sx={{
                  "& label": { color: "text.primary" },
                  "& input": {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#333643" : "white",
                  },
                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    borderRadius: 1,
                  },
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: "none",
                    border: "0.5px solid",
                    borderColor: (theme) => theme.palette.success.main,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.success.main,
                    },
                  }}
                >
                  Add
                </Button>
                <ClearIcon
                  fontSize="small"
                  sx={{
                    cursor: "pointer",
                    color: (theme) => theme.palette.warning.light,
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Column;
