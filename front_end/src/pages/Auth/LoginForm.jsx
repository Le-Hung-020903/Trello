import { Card as MuiCard } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Zoom from "@mui/material/Zoom";
import Typography from "@mui/material/Typography";
import React from 'react'
import LockIcon from "@mui/icons-material/Lock";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import {
  FIELD_REQUIRE_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from "~/utils/validators";

const LoginForm = () => {
  const {register, handleSubmit, formState: {errors }} = useForm()
  const submitLogin = (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(submitLogin)}>
      <Zoom in={true} style={{ transitionDelay: "200ms" }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: "6em" }}>
          <Box
            sx={{
              margin: "1em",
              display: "flex",
              justifyContent: "center",
              gap: 1,
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
              color: (theme) => theme.palette.grey[500],
            }}
          >
            Author: Le Dinh Hung
          </Box>
          {/* <Box
            sx={{
              marginTop: "1em",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              padding: "0 1em",
            }}
          >
            <Alert
              severity="success"
              sx={{ ".MuiAlert-message": { overflow: "hidden" } }}
            >
              Your email&nbsp;
              <Typography
                variant="span"
                sx={{ fontWeight: "bold", "&:hover": { color: "#fdba26" } }}
              >
                lehung020903@gmail.com
              </Typography>
              &nbsp;has been verified.
              <br /> Now you can login to enjoy our service! Have a good day!
            </Alert>
            <Alert
              severity="info"
              sx={{ ".MuiAlert-message": { overflow: "hidden" } }}
            >
              An email has been sent to&nbsp;
              <Typography
                variant="span"
                sx={{ fontWeight: "bold", "&:hover": { color: "#fdba26" } }}
              >
                lehung020903@gmail.com
              </Typography>
              <br />
              Please check and verrify your account before logging in!
            </Alert>
          </Box> */}
          <Box sx={{ padding: "0 1em 1em 1em" }}>
            <Box sx={{ marginTop: "1em" }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter Email...!"
                type="text"
                variant="outlined"
                error={!!errors["email"]}
                {...register("email", {
                  required: FIELD_REQUIRE_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE,
                  },
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={"email"} />
            </Box>
            <Box sx={{ marginTop: "1em" }}>
              <TextField
                fullWidth
                label="Enter Password...!"
                type="password"
                error={!!errors["password"]}
                variant="outlined"
                {...register("password", {
                  required: FIELD_REQUIRE_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={"password"} />
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
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: "0 1em 1em 1em", textAlign: "center" }}>
            <Typography>New to Trello</Typography>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ color: "primaty.main", "&:hover": { color: "#ffbb39" } }}
              >
                Create account!
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  );
}

export default LoginForm
