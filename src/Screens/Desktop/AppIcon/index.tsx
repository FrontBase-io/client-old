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
        <div style={{ flex: 1, verticalAlign: "bottom", lineHeight: "60px" }}>
          <Icon icon="settings" style={{ lineHeight: "100%" }} />
        </div>
        <div
          style={{
            flex: 1,
            verticalAlign: "top",
            textDecoration: "none",
            marginTop: -20,
          }}
        >
          {app.name}
        </div>
      </div>
    </Link>
  );
};

export default AppIcon;
