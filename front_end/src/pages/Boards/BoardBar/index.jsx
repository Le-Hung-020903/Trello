import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dashboard from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import FilterListIcon from "@mui/icons-material/FilterList";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const menu_styles = {
  color: "white",
  bgcolor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: `4px`,
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    bgcolor: "primary.50",
  },
};
const BoardBar = () => {
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
        borderBottom: "1px solid white",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2c3e50" : "#1976D2",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          sx={menu_styles}
          icon={<Dashboard />}
          label="Đình Hùng Full Stack"
          clickable
        ></Chip>
        <Chip
          sx={menu_styles}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
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
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "white",
            },
          }}
        >
          Invite
        </Button>
        <Box>
          <AvatarGroup
            max={4}
            sx={{
              gap: "10px",
              "& .MuiAvatar-root": {
                width: 34,
                height: 34,
                fontSize: 16,
                border: "none",
              },
            }}
          >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
          </AvatarGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default BoardBar;
