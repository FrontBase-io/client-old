import React, { useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useGlobal, useState } from "reactn";
import "./App.css";
import socket, { serverUrl } from "./Utils/Socket";
import asyncComponent from "./AsyncComponent";
import { ResponseType } from "./Utils/Types";
import Socket from "./Utils/Socket";
import Hidden from "@material-ui/core/Hidden";
import { createTheme, ThemeProvider } from "@material-ui/core";
const Onboard = asyncComponent(() => import("./Screens/Onboard"));
const Login = asyncComponent(() => import("./Screens/LogIn"));
const Desktop = asyncComponent(() => import("./Screens/Desktop"));
const Mobile = asyncComponent(() => import("./Screens/Mobile"));

function App() {
  // Vars
  const [, setUser] = useGlobal<any>("user");
  const [mode, setMode] = useState<"onboard" | "logIn" | "loading" | "normal">(
    "loading"
  );
  const [colors, setColors] = useGlobal<any>("colors");
  const [theme, setTheme] = useGlobal<any>("theme");
  const setPrimaryColor = (color?: string) => {
    if (!color) color = "#0283ff";
    setTheme({
      ...theme,
      palette: {
        ...theme.palette,
        primary: { ...theme.palette.primary, main: color },
      },
    });
    setColors({ ...colors, primary: { ...colors.primary, hex: color } });
  };

  // Lifecycle
  useEffect(() => {
    // Basic interactions
    console.log(`Connecting to ${serverUrl}`);
    socket.emit("alive?", (response: ResponseType) => {
      if (response.success) {
        if (localStorage.getItem("username")) {
          setMode("loading");
          // Attempt token sign in
          Socket.emit(
            "logIn",
            {
              username: localStorage.getItem("username"),
              token: localStorage.getItem("token"),
            },
            (response: ResponseType) => {
              if (response.success) {
                setUser(response.user);
                setMode("normal");
              } else {
                setMode("logIn");
              }
            }
          );
        } else {
          setMode("logIn");
        }
      }
    });
    socket.on("mode set to onboard", () => {
      setMode("onboard");
    });

    // Colors
    setColors({ primary: { hex: "#0283ff" } });
    setTheme({
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
    });
  }, []);

  // UI
  if (mode === "loading") return <CircularProgress />;
  return (
    <>
      {mode === "onboard" ? (
        <Onboard />
      ) : mode === "logIn" ? (
        <Login />
      ) : (
        <ThemeProvider theme={createTheme(theme)}>
          <Hidden xsDown>
            <Desktop utils={{ setPrimaryColor }} />
          </Hidden>
          <Hidden smUp>
            <Mobile />
          </Hidden>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;

export interface AppUtilsType {
  setPrimaryColor: (color?: string) => void;
}
