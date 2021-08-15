import { CSSProperties } from "@material-ui/core/styles/withStyles";
import React from "react";

const Icon: React.FC<{ icon: string; style?: CSSProperties }> = ({
  icon,
  style,
}) => {
  return (
    <span className="material-icons-round" style={style}>
      {icon}
    </span>
  );
};

export default Icon;
