import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../../Components/Design/Icon";
import { AppObjectType } from "../../../../Utils/Types";
import styles from "./styles.module.scss";

const App: React.FC<{ app: AppObjectType }> = ({ app }) => {
  return (
    <Link to={`/${app.key}`}>
      <div
        className={styles.root}
        style={{
          backgroundColor: `rgb(${app.color.r}, ${app.color.g},${app.color.b})`,
        }}
      >
        <Icon icon="settings" />
        {app.name}
      </div>
    </Link>
  );
};

export default App;
