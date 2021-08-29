import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const BooleanInput: React.FC<{
  label: string;
  value?: boolean;
  onChange?: (newValue: boolean) => void;
  disabled?: true | boolean;
  fullWidth?: true;
}> = ({ label, value, onChange, disabled, fullWidth }) => {
  // Vars

  // Lifecycle
  // UI
  return (
    <FormControlLabel
      style={{ ...(fullWidth ? { display: "block" } : {}) }}
      control={
        <Checkbox
          checked={value || false}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange && onChange(event.target.checked)
          }
          disabled={disabled}
          color="primary"
        />
      }
      label={label}
    />
  );
};

export default BooleanInput;
