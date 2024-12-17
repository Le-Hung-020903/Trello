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

// Cấu hình react router dom với BrowserRouter
import { BrowserRouter as Router } from "react-router-dom";

// Cấu hình Redux- Persist
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
const persistor = persistStore(store);
createRoot(document.getElementById("root")).render(
  <Router basename="/">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
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
      </PersistGate>
    </Provider>
  </Router>
);
