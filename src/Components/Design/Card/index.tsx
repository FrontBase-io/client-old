import { IconButton, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { CSSProperties, ReactElement } from "react";
import Icon from "../Icon";
import styles from "./styles.module.scss";

const Card: React.FC<{
  title?: string | ReactElement<any, any>;
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
  titleSecondary?: ReactElement;
  withHorizontalOverflow?: true;
  withVerticalOverflow?: true;
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
  titleSecondary,
  withHorizontalOverflow,
  withVerticalOverflow,
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
        overflowX: withHorizontalOverflow ? "hidden" : "auto",
        overflowY: withVerticalOverflow ? "hidden" : "auto",
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
      {titleSecondary && (
        <span
          style={{
            float: "right",
            padding: withoutPadding && "10px 10px 0 10px",
          }}
        >
          {titleSecondary}
        </span>
      )}
      {title && (
        <Typography
          variant="h5"
          gutterBottom
          onClick={onTitleClick}
          className={styles.title}
          color="primary"
          noWrap
          style={{
            cursor: onTitleClick ? "pointer" : "default",
            padding: withoutPadding && "10px 10px 0 10px",
            ...(window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? { color: "#fff" }
              : {}),
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
