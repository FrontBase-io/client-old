import React, { useState } from "react";
import styles from "./styles.module.scss";
import logo from "./logo.png";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router";
import { useGlobal } from "reactn";
import { AppObjectType } from "../../../Utils/Types";
import NavBarAppIcon from "../AppIcon/AppIconNavBar";
import { useEffect } from "react";
import Socket from "../../../Utils/Socket";
import { ResponseType } from "../../../Utils/Types";
import find from "lodash/find";

const NavBar: React.FC<{
  onOpenAppMenu: (event: React.MouseEvent) => void;
  onOpenUserMenu: (event: React.MouseEvent) => void;
  selectedApp?: AppObjectType;
  apps: AppObjectType[];
}> = ({ onOpenAppMenu, onOpenUserMenu, selectedApp, apps }) => {
  // Vars
  const history = useHistory();
  const [colors] = useGlobal<any>("colors");
  const [favoriteList, setFavoriteList] = useState<string[]>([]);

  //Lifecycle
  useEffect(() => {
    Socket.emit("getUserSetting", "favoriteApps", (response: ResponseType) =>
      setFavoriteList(response.value)
    );
  }, []);
  // UI
  return (
    <div
      className={styles.navbar}
      style={{ backgroundColor: colors.primary.hex }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          overflowX: "visible",
        }}
      >
        <div
          style={{ height: 40, marginBottom: 10 }}
          onClick={(event) => {
            window.location.pathname === "/" || window.location.pathname === ""
              ? onOpenAppMenu(event)
              : history.push("/");
          }}
          onContextMenu={(e) => {
            history.push("/");
            e.preventDefault();
          }}
        >
          <Tooltip
            title={
              window.location.pathname === "/" ||
              window.location.pathname === ""
                ? "View apps"
                : "Go home"
            }
            placement="right"
          >
            <img
              alt="Frontbase Logo"
              src={logo}
              className={styles.logo}
              style={{ width: 54 }}
            />
          </Tooltip>
        </div>
        <div
          style={{
            flex: 1,
            padding: "10px 0",
            width: "100%",
            overflowX: "visible",
          }}
        >
          {selectedApp && !favoriteList.includes(selectedApp.key) && (
            <NavBarAppIcon app={selectedApp} selected />
          )}
          {favoriteList.map((appKey) => (
            <NavBarAppIcon
              app={find(apps, (o) => o.key === appKey) as AppObjectType}
              selected={selectedApp?.key === appKey}
            />
          ))}
        </div>
        <div style={{ height: 40, marginBottom: 10, verticalAlign: "middle" }}>
          <Tooltip
            title={`Hi, Vic!`}
            placement="right"
            onClick={(event) => onOpenUserMenu(event)}
          >
            <Avatar color="primary" style={{ cursor: "pointer" }}>
              Vic
            </Avatar>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
