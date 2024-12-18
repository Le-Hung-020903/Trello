import React, { useState } from "react"
import Box from "@mui/material/Box"
import ModeSelect from "~/components/ModeSelect/ModeSelect"
import AppsIcon from "@mui/icons-material/Apps"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Workspaces from "./Menus/Workspaces"
import Recent from "./Menus/Recent"
import Starred from "./Menus/Starred"
import Templates from "./Menus/templates"
import TextField from "@mui/material/TextField"
import Badge from "@mui/material/Badge"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import Tooltip from "@mui/material/Tooltip"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import Profiles from "./Menus/Profiles"
import LibraryAddIcon from "@mui/icons-material/LibraryAdd"
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import { Link } from "react-router-dom"
const AppBoard = () => {
  const [search, setSearch] = useState("")
  return (
    <Box
      px={2}
      sx={{
        width: "100%",
        height: (theme) => theme.trelloCustom.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link to="/boards">
          <Tooltip title="Board list">
            <AppsIcon sx={{ color: "white", verticalAlign: "middle" }} />
          </Tooltip>
        </Link>
        <Link to="/">
          <Typography
            variant="span"
            sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}
          >
            Trello
          </Typography>
        </Link>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            variant="outlined"
            startIcon={<LibraryAddIcon />}
            sx={{
              color: "white",
              border: "none",
              "&:hover": {
                border: "none"
              }
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <ClearIcon
                    fontSize="small"
                    sx={{ color: "white", cursor: "pointer" }}
                    onClick={() => setSearch("")}
                  />
                </InputAdornment>
              )
            }
          }}
          sx={{
            minWidth: "120px",
            "& label": { color: "white" },
            "& input": { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white"
              },
              "&:hover fieldset": {
                borderColor: "white"
              },
              "&.Mui-focused fieldset": {
                borderColor: "white"
              }
            }
          }}
        />
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="warning" variant="dot" sx={{ cursor: "pointer" }}>
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>
        <Tooltip title="Help" sx={{ cursor: "pointer" }}>
          <HelpOutlineIcon />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBoard
