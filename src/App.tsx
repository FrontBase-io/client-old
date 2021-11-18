import { useCallback, useEffect } from "react";
import { useGlobal, useState } from "reactn";
import "./App.css";
import socket, { serverUrl } from "./Utils/Socket";
import asyncComponent from "./AsyncComponent";
import { ResponseType } from "./Utils/Types";
import Socket from "./Utils/Socket";
import Hidden from "@mui/material/Hidden";
import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import chroma from "chroma-js";
import FrontBaseLoader from "./Components/Loading/FrontBaseLoader";
import { useHistory } from "react-router";

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
  const setPrimaryColor = useCallback(
    (colorString?: string) => {
      if (!colorString) colorString = "#4874a8";
      const color = chroma(colorString);
      if (theme) {
        setTheme({
          ...theme,
          palette: {
            ...theme.palette,
            primary: { ...theme.palette.primary, main: color.hex() },
          },
        });
      }
      setColors({ ...colors, primary: color });
      var metaThemeColor = document.querySelector("meta[name=theme-color]")!;
      metaThemeColor.setAttribute(
        "content",
        window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "#222222"
          : color.hex()
      );
    },
    [theme]
  );
  const history = useHistory();
  history.listen(() => {
    //@ts-ignore
    if (window.swUpdateReady) {
      //@ts-ignore
      window.swUpdateReady = false;
      window.stop();
      window.location.reload();
    }
  });
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
  }, [setColors, setTheme, setUser]);
  // Once per app
  useEffect(() => {
    if (!theme) {
      setTheme({
        palette: {
          primary: { main: "#4874a8" },
          mode:
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

      setPrimaryColor(); // Force the header to match night mode
    }
  }, [theme]);

  // UI
  if (mode === "loading" || !theme) return <FrontBaseLoader />;
  return (
    <>
      {mode === "onboard" ? (
        <Onboard />
      ) : mode === "logIn" ? (
        <Login />
      ) : (
        <ThemeProvider theme={createTheme(theme)}>
          <SnackbarProvider maxSnack={3}>
            <Hidden smDown>
              <Desktop utils={{ setPrimaryColor }} />
            </Hidden>
            <Hidden mdUp>
              <Mobile utils={{ setPrimaryColor }} />
            </Hidden>
          </SnackbarProvider>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;

export interface AppUtilsType {
  setPrimaryColor: (color?: string) => void;
}
