import React from "react";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { TextField } from "@mui/material";

const DateInput: React.FC<{
  label: string;
  value?: Date;
  onChange?: (newValue: Date) => void;
  disabled?: true | boolean;
  autoFocus?: boolean;
}> = ({ label, value, onChange, disabled, autoFocus }) => {
  // Vars

  // Lifecycle
  // UI
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={label}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={(newValue) => newValue && onChange && onChange(newValue)}
        renderInput={(params) => (
          <TextField style={{ margin: "15px 0" }} {...params} />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
