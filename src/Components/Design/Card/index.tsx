import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import styles from "./styles.module.scss";

const Card: React.FC<{
  title?: string;
  style?: CSSProperties;
  onTitleClick?: () => void;
  withShadow?: true;
  withoutPadding?: true;
  withoutMargin?: true;
  shadow?: "default" | "sharp" | "diffuse" | "dreamy" | "short" | "long";
  hoverable?: true | boolean;
  className?: string;
  overflow?: "none" | "auto" | "visible";
}> = ({
  children,
  style,
  title,
  onTitleClick,
  withoutPadding,
  withoutMargin,
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
        margin: withoutMargin ? 0 : 15,
        padding: withoutPadding ? 0 : "5px 10px",
        overflow,
      }}
    >
      {title && (
        <Typography
          variant="h5"
          gutterBottom
          onClick={onTitleClick}
          color="primary"
          style={{
            cursor: onTitleClick ? "pointer" : "default",
            padding: withoutPadding && "10px 10px 0 10px",
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </div>
  );
};

export default Card;
