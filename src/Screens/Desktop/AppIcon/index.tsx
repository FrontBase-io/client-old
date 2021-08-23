import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../Components/Design/Icon";
import { AppObjectType } from "../../../Utils/Types";
import styles from "./styles.module.scss";

const AppIcon: React.FC<{ app: AppObjectType; onClick?: () => void }> = ({
  app,
  onClick,
}) => {
  return (
    <div style={{ width: "100%", textAlign: "center", fontSize: 18 }}>
      <Link
        to={`/${app.key}`}
        onClick={onClick}
        className="no-link"
        style={{ textDecoration: "none" }}
      >
        <div
          className={styles.root}
          style={{
            backgroundColor: `rgb(${app.color.r}, ${app.color.g},${app.color.b})`,
          }}
        >
          <Icon
            icon={app.icon}
            size={32}
            style={{
              display: "flex",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
        {app.name}
      </Link>
    </div>
  );
};

export default AppIcon;
