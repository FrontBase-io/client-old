import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../Components/Design/Icon";
import { AppObjectType } from "../../../Utils/Types";
import styles from "./styles.module.scss";

const NavBarAppIcon: React.FC<{
  app: AppObjectType;
  onClick?: () => void;
  selected?: true;
}> = ({ app, onClick, selected }) => (
  <Link
    to={`/${app.key}`}
    onClick={onClick}
    className="no-link"
    style={{
      width: "100%",
      backgroundColor: "#f4f5f7",
      display: "block",
      padding: "10px",
    }}
  >
    <Tooltip title={app.name} placement="right">
      <div
        className={styles.navbarIcon}
        style={{
          backgroundColor: `rgb(${app.color.r}, ${app.color.g},${app.color.b})`,
        }}
      >
        <div style={{ flex: 1, verticalAlign: "middle" }}>
          <Icon icon="settings" style={{ lineHeight: "100%" }} />
        </div>
      </div>
    </Tooltip>
  </Link>
);

export default NavBarAppIcon;
