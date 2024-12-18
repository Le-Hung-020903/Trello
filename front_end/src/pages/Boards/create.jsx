import React, { useState } from "react"
import LibraryAddIcon from "@mui/icons-material/LibraryAdd"
import CancelIcon from "@mui/icons-material/Cancel"
import {
  Modal,
  RadioGroup,
  styled,
  Box,
  TextField,
  Typography,
  InputAdornment,
  Button,
  FormControlLabel,
  Radio
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import FieldErrorAlert from "~/components/Form/FieldErrorAlert"
import AbcIcon from "@mui/icons-material/Abc"
import { FIELD_REQUIRE_MESSAGE } from "~/utils/validators"
import DescriptionIcon from "@mui/icons-material/Description"
import { createNewBoardAPI } from "~/apis"

const SiderbarItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: "12px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#33485DD" : theme.palette.grey[300]
  },
  "&.active": {
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#e9f2ff",
    color: theme.palette.mode === "dark" ? "#90caf9" : "#0c66e4"
  }
}))

const BOARD_TYPES = {
  PUBLIC: "public",
  PRIVATE: "private"
}
const SidebarCreateBoardModal = ({ afterCreateNewBoard }) => {
  const [open, setOpen] = useState(false)
  const handleOpenModel = () => setOpen(true)
  const handleClodeModel = () => {
    setOpen(false)
    reset()
  }

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const submitCreateNewBoard = (data) => {
    createNewBoardAPI(data).then(() => {
      handleClodeModel()
      afterCreateNewBoard()
    })
  }
  return (
    <>
      <SiderbarItem onClick={handleOpenModel}>
        <LibraryAddIcon fontSize="small" />
        Create new board
      </SiderbarItem>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "white",
            border: "none",
            boxShadow: 24,
            p: "20px 30px",
            outline: 0,
            borderRadius: "8px",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "1A2027" : "white"
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box
                id="modal-modal-title"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LibraryAddIcon />
                <Typography variant="h6">Create a new board</Typography>
              </Box>
              <CancelIcon
                color="error"
                sx={{
                  "&:hover": { color: "error.light" },
                  cursor: "pointer"
                }}
                onClick={handleClodeModel}
              />
            </Box>

            <Box id="modal-modal-description" sx={{ my: 2 }}>
              <form onSubmit={handleSubmit(submitCreateNewBoard)}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Title"
                      type="text"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AbcIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                      {...register("title", {
                        required: FIELD_REQUIRE_MESSAGE,
                        minLength: {
                          value: 3,
                          message: "Min length is 3 characters"
                        },
                        maxLength: {
                          value: 50,
                          message: "Max length is 50 characters"
                        }
                      })}
                      error={!!errors["title"]}
                    />
                    <FieldErrorAlert errors={errors} fieldName={"title"} />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="Description"
                      type="text"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                      {...register("description", {
                        required: FIELD_REQUIRE_MESSAGE,
                        minLength: {
                          value: 3,
                          message: "Min length is 3 characters"
                        },
                        maxLength: {
                          value: 255,
                          message: "Max length is 255 characters"
                        }
                      })}
                      error={!!errors["description"]}
                    />
                    <FieldErrorAlert
                      errors={errors}
                      fieldName={"description"}
                    />
                  </Box>
                  <Controller
                    defaultValue={BOARD_TYPES.PUBLIC}
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        onChange={(e, value) => field.onChange(value)}
                        row
                        value={field.value}
                      >
                        <FormControlLabel
                          value={BOARD_TYPES.PRIVATE}
                          control={<Radio size="small" />}
                          label="Private"
                          labelPlacement="start"
                        />
                        <FormControlLabel
                          value={BOARD_TYPES.PUBLIC}
                          control={<Radio size="small" />}
                          label="Public"
                          labelPlacement="start"
                        />
                      </RadioGroup>
                    )}
                  />
                  <Box sx={{ alignSelf: "flex-end" }}>
                    <Button variant="contained" color="primary" type="submit">
                      Create
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default SidebarCreateBoardModal
