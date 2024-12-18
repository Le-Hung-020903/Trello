import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import LogoutIcon from "@mui/icons-material/Logout"
import LockIcon from "@mui/icons-material/Lock"
import LockResetIcon from "@mui/icons-material/LockReset"
import PasswordIcon from "@mui/icons-material/Password"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { useConfirm } from "material-ui-confirm"
import FieldErrorAlert from "~/components/Form/FieldErrorAlert"
import {
  FIELD_REQUIRE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from "../../utils/validators"
import { useDispatch } from "react-redux"
import { logoutUserAPI, updateUserAPI } from "~/redux/user/userSlice"
const SecurityTab = () => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const confirmChangePassword = useConfirm()
  const handleChangePassword = (data) => {
    confirmChangePassword({
      title: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LogoutIcon sx={{ color: "warning.dark" }} />
          Channge Password
        </Box>
      ),
      description:
        "You have to login again after changing your password. Countinue?",
      confirmationText: "Confirm",
      cancellationText: "Cancel"
    })
      .then(() => {
        const { current_password, new_password } = data
        toast
          .promise(
            dispatch(updateUserAPI({ current_password, new_password })),
            {
              pending: "Updating..."
            }
          )
          .then((res) => {
            if (!res.error) {
              toast.success(
                "Your password updated successfully, please log in again"
              )
              dispatch(logoutUserAPI(false))
            }
          })
      })
      .catch(() => {})
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
        <Typography variant="h5">Security DashBoard</Typography>
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <Box
            sx={{
              width: "400px",
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            s
            <Box>
              <TextField
                focused
                fullWidth
                label="Current Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register("current_password", {
                  required: FIELD_REQUIRE_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors["current_password"]}
              />
              <FieldErrorAlert errors={errors} fieldName={"current_password"} />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register("new_password", {
                  required: FIELD_REQUIRE_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors["new_password"]}
              />
              <FieldErrorAlert errors={errors} fieldName={"new_password"} />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="New Password Confirmation"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register("confirm_password", {
                  required: FIELD_REQUIRE_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors["confirm_password"]}
              />
              <FieldErrorAlert errors={errors} fieldName={"confirm_password"} />
            </Box>
            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleChangePassword}
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

export default SecurityTab
