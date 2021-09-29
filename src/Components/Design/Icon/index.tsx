import React, { CSSProperties } from "react";
import { useGlobal } from "reactn";
import styles from "./styles.module.scss";

const Icon: React.FC<{
  icon: string;
  style?: CSSProperties;
  className?: string;
  size?: number;
  primary?: true | boolean;
}> = ({ icon, style, className, size, primary }) => {
  // Vars
  const [colors] = useGlobal<any>("colors");

  // Lifecycle
  // UI
  return (
    <i
      className={`fa fa-${icon} ${className} ${styles.icon}`}
      style={{
        ...style,
        fontSize: size || 24,
        ...(primary ? { color: colors.primary.hex() } : {}),
      }}
    ></i>
  );
};

export default Icon;
