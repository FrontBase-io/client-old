import React from "react";
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
  autoFocus?: boolean;
}> = ({ label, value, onChange, disabled, keyMode, mode, autoFocus }) => {
  // Vars

  // Lifecycle
  // UI
  return (
    <label>
      {label && <Typography variant="subtitle1">{label}</Typography>}
      {(!mode || mode === "text") && (
        <input
          className={styles.input}
          autoFocus={autoFocus}
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
          autoFocus={autoFocus}
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
