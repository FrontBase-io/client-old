import React from "react";
import styles from "./styles.module.scss";
import Typography from "@material-ui/core/Typography";

const NumberInput: React.FC<{
  label: string;
  value?: number;
  onChange?: (newValue: number) => void;
  password?: true;
  disabled?: true | boolean;
  mode?: "text" | "textarea";
}> = ({ label, value, onChange, disabled }) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <label>
      {label && <Typography variant="subtitle1">{label}</Typography>}
      <input
        className={styles.input}
        type="number"
        value={value}
        onChange={(e) => {
          onChange && onChange(parseInt(e.currentTarget.value));
        }}
        disabled={disabled}
      />
    </label>
  );
};

export default NumberInput;
