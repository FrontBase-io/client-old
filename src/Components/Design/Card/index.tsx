import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import styles from "./styles.module.scss";

const Card: React.FC<{
  title?: string;
  style?: CSSProperties;
  onTitleClick?: () => void;
}> = ({ children, style, title, onTitleClick }) => {
  return (
    <div className={styles.root} style={style}>
      {title && (
        <Typography
          variant="h5"
          gutterBottom
          onClick={onTitleClick}
          style={{ cursor: onTitleClick ? "pointer" : "default" }}
        >
          {title}
        </Typography>
      )}
      {children}
    </div>
  );
};

export default Card;
