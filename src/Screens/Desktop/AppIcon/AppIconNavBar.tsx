import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { useHistory } from "react-router-dom";
import Icon from "../../../Components/Design/Icon";
import { AppObjectType } from "../../../Utils/Types";
import styles from "./styles.module.scss";

const NavBarAppIcon: React.FC<{
  app: AppObjectType;
  onClick?: () => void;
  selected?: true | boolean;
  onRightClick: (
    event: React.MouseEvent<HTMLDivElement>,
    app: AppObjectType
  ) => void;
}> = ({ app, onClick, selected, onRightClick }) => {
  const history = useHistory();

  return (
    <Tooltip title={app.name} placement="right">
      <div
        className={`${styles.navbarIconPlate} ${selected && styles.selected}`}
        onClick={(e) => {
          onClick && onClick();
          history.push(`/${app.key}`);
        }}
        onContextMenu={(e) => onRightClick(e, app)}
      >
        <div
          className={`${styles.navbarIconPlate} ${selected && styles.selected}`}
          style={{
            backgroundColor: `rgb(${app.color.r}, ${app.color.g},${app.color.b})`,
            borderRadius: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              verticalAlign: "middle",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Icon icon={app.icon} size={22} />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default NavBarAppIcon;
