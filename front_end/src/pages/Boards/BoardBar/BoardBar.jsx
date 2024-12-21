import React from "react"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Dashboard from "@mui/icons-material/Dashboard"
import VpnLockIcon from "@mui/icons-material/VpnLock"
import AddToDriveIcon from "@mui/icons-material/AddToDrive"
import FilterListIcon from "@mui/icons-material/FilterList"
import { capitalize } from "~/utils/formatters"
import { Tooltip } from "@mui/material"
import BoardUserGroup from "./BoardUserGroup"
import InviteBoardUser from "./InviteBoardUser"
const menu_styles = {
  color: "white",
  bgcolor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: `4px`,
  ".MuiSvgIcon-root": {
    color: "white"
  },
  "&:hover": {
    bgcolor: "primary.50"
  }
}
const BoardBar = ({ board }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976D2"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={menu_styles}
            icon={<Dashboard />}
            label={board?.title}
            clickable
          ></Chip>
        </Tooltip>
        <Chip
          sx={menu_styles}
          icon={<VpnLockIcon />}
          label={capitalize(board?.type)}
          clickable
        ></Chip>
        <Chip
          sx={menu_styles}
          icon={<AddToDriveIcon />}
          label="Add to google drive"
          clickable
        ></Chip>
        <Chip
          sx={menu_styles}
          icon={<FilterListIcon />}
          label="Add to google drive"
          clickable
        ></Chip>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <InviteBoardUser boardId={board?._id} />
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
