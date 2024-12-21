import React from "react"
import Button from "@mui/material/Button"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser, updateUserAPI } from "~/redux/user/userSlice"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import InputAdornment from "@mui/material/InputAdornment"
import MailIcon from "@mui/icons-material/Mail"
import TextField from "@mui/material/TextField"
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded"
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded"
import { FIELD_REQUIRE_MESSAGE, singleFileValidator } from "~/utils/validators"
import FieldErrorAlert from "~/components/Form/FieldErrorAlert"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput"

const AccountTab = () => {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const initialGeneralForm = {
    displayName: currentUser?.displayName
  }

  // Sử dụng default value để set giá trị mặc định cho các field cần thiết
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialGeneralForm
  })
  const uploadAvatar = (e) => {
    // Lấy filee thông qua e.target.files[0] và validate nó trước khi xử lý
    const error = singleFileValidator(e.target.files[0])
    if (error) {
      toast.error(error)
      return
    }
    // Xử dụng form data để xử lý dữ liệu liên quan đến file khi gọi API
    let reqData = new FormData()
    reqData.append("avatar", e.target.files[0])

    // Cách để log dữ liệu qua form data
    // for (const vale of reqData.values()) {
    //   console.log("reqData value: ", vale)
    // }
    // GỌI APOI
    toast
      .promise(dispatch(updateUserAPI(reqData)), {
        pending: "Updating..."
      })
      .then((res) => {
        if (!res.error) {
          toast.success("User updated successfully")
        }

        // Dù có lỗi hay không vẫn phải clear đi file input,
        // nếu không thì sẽ khônh thể chọn cùng 1 file liên tiếp
        e.target.value = ""
      })
  }
  const submitChangeGeneralInformation = (data) => {
    const { displayName } = data
    if (displayName === currentUser?.displayName) return
    toast
      .promise(dispatch(updateUserAPI({ displayName })), {
        pending: "Updating..."
      })
      .then((res) => {
        if (!res.error) {
          toast.success("User updated successfully")
        }
      })
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Avatar
              sx={{ width: 84, height: 84, mb: 1 }}
              alt="Le dinh hung"
              src={currentUser?.avatar}
            />
            <Tooltip title="Upload a new image update your avatar immediately">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload files
                <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant="h6">{currentUser?.displayName}</Typography>
            <Typography sx={{ color: "grey" }}>
              @{currentUser?.username}
            </Typography>
          </Box>
        </Box>
        <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
          <Box
            sx={{
              width: "400px",
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label="Your email"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.username}
                fullWidth
                label="Your username"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxRoundedIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                defaultValue={currentUser?.username}
                fullWidth
                label="Your display name"
                type="text"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIndRoundedIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register("displayName", {
                  required: FIELD_REQUIRE_MESSAGE
                })}
                error={!!errors["displayName"]}
              />
              <FieldErrorAlert errors={errors} fieldName={"displayName"} />
            </Box>

            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default AccountTab
