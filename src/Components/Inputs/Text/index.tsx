import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Typography from "@material-ui/core/Typography";

const TextInput: React.FC<{
  label: string;
  value?: string;
  onChange?: (newValue: string) => void;
  password?: true;
  disabled?: true | boolean;
  keyMode?: true | boolean;
}> = ({ label, value, onChange, disabled, keyMode }) => {
  // Vars

  // Lifecycle
  // UI
  return (
    <label>
      {label && <Typography variant="subtitle1">{label}</Typography>}
      <input
        className={styles.input}
        value={value}
        onChange={(e) => {
          onChange &&
            onChange(
              keyMode
                ? e.currentTarget.value.replace(/\W/g, "").toLowerCase()
                : e.currentTarget.value
            );
        }}
        disabled={disabled}
      />
    </label>
  );
};

export default TextInput;
