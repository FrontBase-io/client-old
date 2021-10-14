import React, { CSSProperties } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface OptionType {
  label: string;
  value: string;
}

const OptionsInput: React.FC<{
  label: string;
  value: string | string[];
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
    <>Mode checkbox not built yet</>
  );
};

export default OptionsInput;
