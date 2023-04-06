import ReactDOM from "react-dom/client";

import { CssBaseline } from "@mui/material";

import { AppContextProvider } from "./context/AppContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppContextProvider>
    <>
      <CssBaseline />
      <App />
    </>
  </AppContextProvider>
);
