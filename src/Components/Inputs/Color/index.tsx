import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { ChromePicker } from "react-color";
import { ColorType } from "../../../Utils/Types";

const ColorInput: React.FC<{
  label?: string;
  value?: ColorType;
  onChange?: (newValue: ColorType) => void;
  password?: true;
  disabled?: true | boolean;
  mode?: "text" | "textarea";
  autoFocus?: boolean;
}> = ({ label, value, onChange, disabled }) => {
  // Vars
  const [newValue, setNewValue] = useState<ColorType | undefined>(value);

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);
  // UI
  return (
    <label>
      {label && <Typography variant="subtitle1">{label}</Typography>}
      <ChromePicker
        color={newValue}
        onChange={(color) => setNewValue(color.rgb)}
        onChangeComplete={(color) => {
          onChange && onChange(color.rgb);
        }}
      />
    </label>
  );
};

export default ColorInput;
