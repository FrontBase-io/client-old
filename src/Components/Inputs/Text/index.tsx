import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Typography from "@material-ui/core/Typography";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

const TextInput: React.FC<{
  label: string;
  value?: string;
  onChange?: (newValue: string) => void;
  password?: true;
  disabled?: true | boolean;
  keyMode?: true | boolean;
  mode?: "text" | "textarea";
}> = ({ label, value, onChange, disabled, keyMode, mode }) => {
  // Vars

  // Lifecycle
  // UI
  return (
    <label>
      {label && <Typography variant="subtitle1">{label}</Typography>}
      {(!mode || mode === "text") && (
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
      )}
      {mode === "textarea" && (
        <TextareaAutosize
          className={styles.input}
          maxRows={8}
          value={value}
          style={{ width: "100%" }}
          onChange={(e) => {
            onChange &&
              onChange(
                keyMode
                  ? e.currentTarget.value.replace(/\W/g, "").toLowerCase()
                  : e.currentTarget.value
              );
          }}
        />
      )}
    </label>
  );
};

export default TextInput;
