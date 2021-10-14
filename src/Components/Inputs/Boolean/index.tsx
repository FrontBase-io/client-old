import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

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
