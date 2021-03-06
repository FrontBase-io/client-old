import React from "react";
import styles from "./styles.module.scss";
import Typography from "@mui/material/Typography";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import slugify from "slugify";

const TextInput: React.FC<{
  label?: string;
  value?: string;
  onChange?: (newValue: string) => void;
  password?: true;
  type?: "date" | "url";
  disabled?: true | boolean;
  keyMode?: true | boolean;
  mode?: "text" | "textarea";
  autoFocus?: boolean;
  placeholder?: string;
  onEnter?: () => void;
}> = ({
  label,
  value,
  onChange,
  disabled,
  keyMode,
  mode,
  autoFocus,
  type,
  password,
  placeholder,
  onEnter,
}) => {
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
          type={password ? "password" : type || "text"}
          placeholder={placeholder}
          onChange={(e) => {
            onChange &&
              onChange(
                keyMode
                  ? slugify(e.currentTarget.value).toLowerCase()
                  : e.currentTarget.value
              );
          }}
          disabled={disabled}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              onEnter && onEnter();
            }
          }}
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
