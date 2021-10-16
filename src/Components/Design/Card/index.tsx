import { IconButton, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { CSSProperties } from "react";
import Icon from "../Icon";
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
  onExplanation?: () => void;
  ref?: React.Ref<any>;
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
  onExplanation,
}) => {
  return (
    <div
      className={`Card ${styles.card} ${
        hoverable && styles.hoverable
      } ${className} ${
        shadow !== undefined && shadow !== "default" && styles[shadow]
      }`}
      style={{
        margin: withoutMargin ? 0 : 10,
        padding: withoutPadding ? 0 : "5px 10px",
        overflow,
        ...style,
      }}
    >
      {onExplanation && (
        <Tooltip placement="left" title="Explanation">
          <IconButton style={{ float: "right" }} onClick={onExplanation}>
            <Icon icon="question" size={15} />
          </IconButton>
        </Tooltip>
      )}
      {title && (
        <Typography
          variant="h5"
          gutterBottom
          onClick={onTitleClick}
          className={styles.title}
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
