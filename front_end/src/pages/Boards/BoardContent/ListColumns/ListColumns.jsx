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
const ListColumns = (props) => {
  const listColumns = props.listColumns;
  const createNewColumn = props.createNewColumn;
  const createNewCard = props.createNewCard;
  const deleteColumnDetail = props.deleteColumnDetail;
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const addNewColumn =  () => {
    if(!newColumnTitle){
      toast.error("please enter column title")
      return 
    }
    const newColumnData = {
      title: newColumnTitle
    }
    createNewColumn(newColumnData)
    toggleOpenNewColumnForm()
    setNewColumnTitle("")
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
            createNewCard={createNewCard}
            deleteColumnDetail={deleteColumnDetail}
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
