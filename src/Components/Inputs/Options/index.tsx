import React, { CSSProperties } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { remove } from "lodash";

interface OptionType {
  label: string;
  value: string;
}

const OptionsInput: React.FC<{
  label?: string;
  value?: string | string[];
  options: OptionType[];
  mode?: "radio" | "checkbox";
  onChange?: (value: string | string[]) => void;
  disabled?: true | boolean;
  style?: CSSProperties;
  autoFocus?: boolean;
}> = ({
  label,
  value,
  onChange,
  disabled,
  options,
  style,
  autoFocus,
  mode,
}) => {
  // Vars

  // Lifecycle

  // UI
  return mode === "radio" || !mode ? (
    <FormControl component="fieldset">
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        color="primary"
      >
        {options.map((option) => (
          <FormControlLabel
            value={option.value}
            control={<Radio />}
            label={option.label}
            key={option.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  ) : (
    <FormControl
      sx={{ m: 3 }}
      variant="standard"
      style={{ display: "block", margin: "10px 0" }}
    >
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={(value || []).includes(option.value)}
                onChange={() => {
                  const newValue = (value as string[]) || [];
                  newValue.includes(option.value)
                    ? remove(newValue, (o) => o === option.value)
                    : newValue.push(option.value);
                  onChange && onChange(newValue);
                }}
                name={option.value}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default OptionsInput;
