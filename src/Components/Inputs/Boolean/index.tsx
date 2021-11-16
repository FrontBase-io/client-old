import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Icon from "../../Design/Icon";
import Tooltip from "@mui/material/Tooltip";

const BooleanInput: React.FC<{
  label: string;
  value?: boolean;
  onChange?: (newValue: boolean) => void;
  disabled?: true | boolean;
  fullWidth?: true;
  explanation?: string;
  withoutPropagation?: true;
}> = ({
  label,
  value,
  onChange,
  disabled,
  fullWidth,
  explanation,
  withoutPropagation,
}) => {
  // Vars

  // Lifecycle
  // UI
  return (
    <FormControlLabel
      style={{ ...(fullWidth ? { display: "block" } : {}) }}
      control={
        <Checkbox
          checked={value || false}
          onMouseDown={(event) => withoutPropagation && event.stopPropagation()}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange && onChange(event.target.checked);
          }}
          disabled={disabled}
          color="primary"
        />
      }
      label={
        <>
          {label}
          {explanation && (
            <Tooltip title={explanation} placement="left">
              <Icon
                icon="question-circle"
                size={13}
                style={{ marginLeft: 5 }}
              />
            </Tooltip>
          )}
        </>
      }
    />
  );
};

export default BooleanInput;
