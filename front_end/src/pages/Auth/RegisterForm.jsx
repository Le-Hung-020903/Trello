import { Card as MuiCard } from "@mui/material"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Zoom from "@mui/material/Zoom"
import Typography from "@mui/material/Typography"
import React from "react"
import LockIcon from "@mui/icons-material/Lock"
import TextField from "@mui/material/TextField"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import FieldErrorAlert from "~/components/Form/FieldErrorAlert"
import {
  FIELD_REQUIRE_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from "~/utils/validators"
import { registerUserAPI } from "~/apis"
import { toast } from "react-toastify"

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()
  const navigate = useNavigate()
  const submitRegister = (data) => {
    const { email, password } = data
    toast
      .promise(registerUserAPI({ email, password }), {
        pending: "Register is in progress..."
      })
      .then((user) => {
        navigate(`/login?registedEmail=${user.email}`)
      })
  }
  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: "200ms" }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: "6em" }}>
          <Box
            sx={{
              margin: "1em",
              display: "flex",
              justifyContent: "center",
              gap: 1
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <LockIcon />
            </Avatar>
          </Box>
          <Box
            sx={{
              marginTop: "1em",
              display: "flex",
              justifyContent: "center",
              padding: "0 1em",
              color: (theme) => theme.palette.grey[500]
            }}
          >
            Author: Le Dinh Hung
          </Box>
          <Box sx={{ padding: "0 1em 1em 1em" }}>
            <Box sx={{ marginTop: "1em" }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                error={!!errors["email"]}
                variant="outlined"
                {...register("email", {
                  required: FIELD_REQUIRE_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={"email"} />
            </Box>
            <Box sx={{ marginTop: "1em" }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                error={!!errors["password"]}
                variant="outlined"
                {...register("password", {
                  required: FIELD_REQUIRE_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={"password"} />
            </Box>
            <Box sx={{ marginTop: "1em" }}>
              <TextField
                fullWidth
                label="Enter Password Confirmation..."
                type="password"
                error={!!errors["password_confirm"]}
                variant="outlined"
                {...register("password_confirm", {
                  validate: (value) => {
                    if (watch("password") !== value)
                      return "Your password don't match"
                    return true
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={"password_confirm"} />
            </Box>
          </Box>
          <CardActions sx={{ padding: "0 1em 1em 1em" }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Register
            </Button>
          </CardActions>
          <Box sx={{ padding: "0 1em 1em 1em", textAlign: "center" }}>
            <Typography>Already have an account?</Typography>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ color: "primaty.main", "&:hover": { color: "#ffbb39" } }}
              >
                Log in!
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm
