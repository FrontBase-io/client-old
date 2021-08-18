import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";
import "material-icons/iconfont/round.css";
import "./Style.scss";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider
      theme={createTheme({
        palette: {
          primary: { main: "#0283ff" },
          type:
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light",
        },
        props: {
          MuiTooltip: {
            arrow: true,
          },
        },
      })}
    >
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
