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
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import AttachmentIcon from "@mui/icons-material/Attachment";
const BoardContent = () => {
  const COLUMN_HEADER_HEIGHT = "50px";
  const COLUMN_FOOTER_HEIGHT = "60px";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
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
        <Box
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
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold", cursor: "pointer" }}>
              Column Title
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
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize="small" />
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
                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
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
          {/* cards column */}
          <Box
            sx={{
              p: "0 5px",
              m: "0 5px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflowY: "auto !important",
              overflowX: "hidden !important",
              maxHeight: (theme) =>
                `calc(${theme.trelloCustom.boardContentHeight} - 
                ${theme.spacing(5)} - 
                (${COLUMN_HEADER_HEIGHT} + ${COLUMN_FOOTER_HEIGHT}))`,
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ced0da",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#bfc2cf",
              },
            }}
          >
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image="https://png.pngtree.com/thumb_back/fh260/background/20230511/pngtree-nature-background-sunset-wallpaer-with-beautiful-flower-farms-image_2592160.jpg"
                title="green iguana"
              />
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button startIcon={<GroupIcon />} size="small">
                  20
                </Button>
                <Button startIcon={<ModeCommentIcon />} size="small">
                  20
                </Button>
                <Button startIcon={<AttachmentIcon />} size="small">
                  20
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard 02</Typography>
              </CardContent>
            </Card>
          </Box>
          {/* footer column */}
          <Box
            sx={{
              height: COLUMN_FOOTER_HEIGHT,
              display: "flex",
              p: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </Box>
        <Box
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
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold", cursor: "pointer" }}>
              Column Title
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
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize="small" />
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
                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
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
          {/* cards column */}
          <Box
            sx={{
              p: "0 5px",
              m: "0 5px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflowY: "auto !important",
              overflowX: "hidden !important",
              maxHeight: (theme) =>
                `calc(${theme.trelloCustom.boardContentHeight} - 
                ${theme.spacing(5)} - 
                (${COLUMN_HEADER_HEIGHT} + ${COLUMN_FOOTER_HEIGHT}))`,
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ced0da",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#bfc2cf",
              },
            }}
          >
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image="https://png.pngtree.com/thumb_back/fh260/background/20230511/pngtree-nature-background-sunset-wallpaer-with-beautiful-flower-farms-image_2592160.jpg"
                title="green iguana"
              />
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button startIcon={<GroupIcon />} size="small">
                  20
                </Button>
                <Button startIcon={<ModeCommentIcon />} size="small">
                  20
                </Button>
                <Button startIcon={<AttachmentIcon />} size="small">
                  20
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Lizard 02</Typography>
              </CardContent>
            </Card>
          </Box>
          {/* footer column */}
          <Box
            sx={{
              height: COLUMN_FOOTER_HEIGHT,
              display: "flex",
              p: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BoardContent;
