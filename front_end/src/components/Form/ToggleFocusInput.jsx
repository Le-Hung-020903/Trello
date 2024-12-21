import TextField from "@mui/material/TextField"
import React, { useState } from "react"

const ToggleFocusInput = ({
  value,
  onChangedValue,
  inputFontSize = "16px",
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value)
  const triggleBlur = () => {
    setInputValue(inputValue.trim())

    // Nếu giá trị không thay đổi thì return luôn
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }
    // console.log("value: ", value)
    // console.log("inputvalue: ", inputValue)

    onChangedValue(inputValue)
  }
  return (
    <TextField
      id="toggle-focus-input-controlled"
      fullWidth
      variant="outlined"
      size="small"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value)
      }}
      onBlur={triggleBlur}
      {...props}
      sx={{
        "& label": {},
        "& input": { fontSize: inputFontSize, fontWeight: "bold" },
        "& .MuiOutlinedInput-root": {
          backgroundColor: "transparent",
          "& fieldset": { borderColor: "transparent" }
        },
        "& .MuiOutlinedInput-root:hover": {
          borderColor: "transparent",
          "& fieldset": { borderColor: "transparent" }
        },
        "& .MuiOutlinedInput-root.Mui-focused": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#33485D" : "white",
          "& fieldset": { borderColor: "primary.main" }
        },
        "&.MuiOutlinedInput-input": {
          px: "6px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis"
        }
      }}
    ></TextField>
  )
}

export default ToggleFocusInput
