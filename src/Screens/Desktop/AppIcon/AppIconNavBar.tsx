import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../Components/Design/Icon";
import { AppObjectType } from "../../../Utils/Types";
import styles from "./styles.module.scss";

const NavBarAppIcon: React.FC<{
  app: AppObjectType;
  onClick?: () => void;
  selected?: true | boolean;
}> = ({ app, onClick, selected }) => (
  <Link
    to={`/${app.key}`}
    onClick={onClick}
    className={`${styles.navbarIconPlate} ${selected && styles.selected}`}
  >
    <Tooltip title={app.name} placement="right">
      <div
        className={styles.navbarIcon}
        style={{
          backgroundColor: `rgb(${app.color.r}, ${app.color.g},${app.color.b})`,
        }}
      >
        <div style={{ flex: 1, verticalAlign: "middle" }}>
          <Icon icon={app.icon} size={24} />
        </div>
      </div>
    </Tooltip>
  </Link>
);

export default NavBarAppIcon;
