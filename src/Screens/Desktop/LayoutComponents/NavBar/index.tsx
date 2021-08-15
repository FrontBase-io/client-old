import React from "react";
import styles from "./styles.module.scss";
import logo from "./fb.png";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
const NavBar: React.FC<{
  onOpenAppMenu: (event: React.MouseEvent) => void;
  onOpenUserMenu: (event: React.MouseEvent) => void;
}> = ({ onOpenAppMenu, onOpenUserMenu }) => {
  // Vars
  //Lifecycle
  // UI
  return (
    <div className={styles.navbar}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div
          style={{ height: 40, marginBottom: 10 }}
          onClick={(event) => onOpenAppMenu(event)}
        >
          <Tooltip title="View apps" placement="right">
            <img
              alt="Frontbase Logo"
              src={logo}
              className={styles.logo}
              style={{ width: 54 }}
            />
          </Tooltip>
        </div>
        <div style={{ flex: 1, padding: "10px 0" }}></div>
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
