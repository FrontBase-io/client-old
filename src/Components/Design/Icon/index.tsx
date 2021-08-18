import { CSSProperties } from "@material-ui/core/styles/withStyles";
import React from "react";

const Icon: React.FC<{
  icon: string;
  style?: CSSProperties;
  className?: string;
}> = ({ icon, style, className }) => {
  return (
    <span style={style} className={`material-icons-round ${className}`}>
      {icon}
    </span>
  );
};

export default Icon;
