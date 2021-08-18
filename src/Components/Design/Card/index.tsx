import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import styles from "./styles.module.scss";

const Card: React.FC<{
  title?: string;
  style?: CSSProperties;
  onTitleClick?: () => void;
  withShadow?: true;
  shadow?: "default" | "sharp" | "diffuse" | "dreamy" | "short" | "long";
  hoverable?: true | boolean;
  className?: string;
  overflow?: "none" | "auto" | "visible";
}> = ({
  children,
  style,
  title,
  onTitleClick,
  withShadow,
  shadow,
  hoverable,
  className,
  overflow,
}) => {
  return (
    <div
      className={`Card ${styles.card} ${
        hoverable && styles.hoverable
      } ${className} ${
        shadow !== undefined && shadow !== "default" && styles[shadow]
      }`}
      style={{
        ...style,
        margin: 15,
        overflow,
      }}
    >
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
