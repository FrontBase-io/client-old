import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect } from "react";
import { useGlobal, useState } from "reactn";
import "./App.css";
import socket, { serverUrl } from "./Utils/Socket";
import asyncComponent from "./AsyncComponent";
import { ResponseType } from "./Utils/Types";
import Socket from "./Utils/Socket";
import Hidden from "@material-ui/core/Hidden";
const Onboard = asyncComponent(() => import("./Screens/Onboard"));
const Login = asyncComponent(() => import("./Screens/LogIn"));
const Desktop = asyncComponent(() => import("./Screens/Desktop"));
const Mobile = asyncComponent(() => import("./Screens/Mobile"));

function App() {
  // Vars
  const [user, setUser] = useGlobal<any>("user");
  const [mode, setMode] = useState<"onboard" | "logIn" | "loading" | "normal">(
    "loading"
  );
  // Lifecycle
  useEffect(() => {
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
        <>
          <Hidden xsDown>
            <Desktop />
          </Hidden>
          <Hidden smUp>
            <Mobile />
          </Hidden>
        </>
      )}
    </>
  );
}

export default App;
