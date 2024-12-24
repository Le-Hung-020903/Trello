import { useEffect, useState } from "react"
import moment from "moment"
import Badge from "@mui/material/Badge"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import DoneIcon from "@mui/icons-material/Done"
import NotInterestedIcon from "@mui/icons-material/NotInterested"
import { useSelector, useDispatch } from "react-redux"
import {
  addNotification,
  fetchInvitationsAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI
} from "~/redux/notifications/notificationSlice"
import { soketIoInstance } from "~/socketClient"
import { selectCurrentUser } from "~/redux/user/userSlice"
import { useNavigate } from "react-router"
const BOARD_INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED"
}

function Notifications() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    setNewNotification(false) // reset trạng thái khi mở thông báo
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // kiểm tra xem có thông báo mới hay không
  const [newNotification, setNewNotification] = useState(false)

  // Lấy dữ liệu từi Notifications, user từ trong redux
  const notifications = useSelector(selectCurrentNotifications)
  const curentUser = useSelector(selectCurrentUser)

  // fetch danh sách các lời mời invitations
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchInvitationsAPI())

    // Tạo 1 function xử lý khi nhận được sự kiện real-time
    const onReceiveInvitation = (invitation) => {
      console.log("Lang nghe tu be ve notification: ", invitation)
      // Nếu thằng user đang đăng nhập hiện tại mà chúng ta lưu ở redux chính là invitee trong invitation
      if (invitation.inviteeId === curentUser._id) {
        //b1: thêm bản ghi invitaion mới vào trong redux
        dispatch(addNotification(invitation))

        //b2: set new notification để hiển thị badge
        setNewNotification(true)
      }
    }

    // Lắng nghe sự kiện real-time có tên là BE_USER_INVITED_TO_BOARD từ phía BE
    soketIoInstance.on("BE_USER_INVITED_TO_BOARD", onReceiveInvitation)

    // Clean up sự kiện để ngăn chặn bị đăng ký lặp lại sự kiện
    return () => {
      soketIoInstance.off("BE_USER_INVITED_TO_BOARD", onReceiveInvitation)
    }
  }, [dispatch, curentUser._id])

  const updateBoardInvitation = (status, invitationId) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId })).then((res) => {
      if (
        res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED
      ) {
        navigate(`/board/${res.payload.boardInvitation.boardId}`)
      }
    })
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant={newNotification ? "dot" : "standard"}
          sx={{ cursor: "pointer" }}
          id="basic-button-open-notification"
          aria-controls={open ? "basic-notification-drop-down" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon
            sx={{
              color: newNotification ? "yellow" : "white"
            }}
          />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "basic-button-open-notification" }}
      >
        {(!notifications || notifications.length === 0) && (
          <MenuItem sx={{ minWidth: 200 }}>
            You do not have any new notifications.
          </MenuItem>
        )}
        {notifications?.map((notification, index) => {
          return (
            <Box key={notification._id || index}>
              <MenuItem
                sx={{
                  minWidth: 200,
                  maxWidth: 360,
                  overflowY: "auto"
                }}
              >
                <Box
                  sx={{
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GroupAddIcon fontSize="small" />
                    <Box>
                      <strong>
                        {notification?.inviter[0]?.displayName ||
                          "Unknown User"}
                      </strong>{" "}
                      had invited you to join the board
                      <strong>
                        {" "}
                        {notification?.board[0]?.title || "Unknown Board"}
                      </strong>
                    </Box>
                  </Box>

                  {notification?.boardInvitation?.status ===
                    BOARD_INVITATION_STATUS.PENDING && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "flex-end"
                      }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() =>
                          updateBoardInvitation(
                            BOARD_INVITATION_STATUS.ACCEPTED,
                            notification._id
                          )
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() =>
                          updateBoardInvitation(
                            BOARD_INVITATION_STATUS.REJECTED,
                            notification._id
                          )
                        }
                      >
                        Reject
                      </Button>
                    </Box>
                  )}

                  {notification?.boardInvitation?.status !==
                    BOARD_INVITATION_STATUS.PENDING && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "flex-end"
                      }}
                    >
                      {notification?.boardInvitation?.status ===
                        BOARD_INVITATION_STATUS.ACCEPTED && (
                        <Chip
                          icon={<DoneIcon />}
                          label="Accepted"
                          color="success"
                          size="small"
                        />
                      )}
                      {notification?.boardInvitation?.status ===
                        BOARD_INVITATION_STATUS.REJECTED && (
                        <Chip
                          icon={<NotInterestedIcon />}
                          label="Rejected"
                          size="small"
                        />
                      )}
                    </Box>
                  )}

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="span" sx={{ fontSize: "13px" }}>
                      {moment(notification?.createdAt).format("llll")}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              {index !== notifications?.length - 1 && <Divider />}
            </Box>
          )
        })}
      </Menu>
    </Box>
  )
}

export default Notifications
