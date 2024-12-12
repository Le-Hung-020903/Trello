import { ConfirmProvider } from "material-ui-confirm";
import { createRoot } from "react-dom/client";
import App from "~/App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "~/theme.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { store } from "./redux/store"
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              dialogProps: { maxWidth: "xs" },
              confirmationButtonProps: { color: "warning", variant: "outlined" },
              cancellationButtonProps: { color: "inherit" },
              allowClose: false,
            }}
          >
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-left" theme="colored" />
          </ConfirmProvider>
      </ThemeProvider>
    </Provider>
);
