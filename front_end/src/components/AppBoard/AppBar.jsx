import React from "react"
import Box from "@mui/material/Box"
import ModeSelect from "~/components/ModeSelect/ModeSelect"
import AppsIcon from "@mui/icons-material/Apps"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Workspaces from "./Menus/Workspaces"
import Recent from "./Menus/Recent"
import Starred from "./Menus/Starred"
import Templates from "./Menus/templates"
import Tooltip from "@mui/material/Tooltip"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import Profiles from "./Menus/Profiles"
import LibraryAddIcon from "@mui/icons-material/LibraryAdd"
import { Link } from "react-router"
import Notifications from "./Notifications/Notifications"
import AutoCompleteSearchBoard from "./SearchBoards/AutoCompleteSearchBoard"
const AppBoard = () => {
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
        <AutoCompleteSearchBoard />
        <ModeSelect />
        {/* Xử lý hiển thị thông báo */}
        <Notifications />
        <Tooltip title="Help" sx={{ cursor: "pointer" }}>
          <HelpOutlineIcon />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBoard
