import React, { useState, useEffect } from "react";
import Select from "react-select";
import find from "lodash/find";
import { useGlobal } from "reactn";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import chroma from "chroma-js";

interface OptionType {
  label: string;
  value: string;
}

const SelectInput: React.FC<{
  label: string;
  value: string;
  options: OptionType[];
  onChange?: (value: string | string[], args?: string | string[]) => void;
  disabled?: true | boolean;
  clearable?: true;
  multi?: true;
  style?: CSSProperties;
}> = ({
  label,
  value,
  onChange,
  disabled,
  options,
  clearable,
  multi,
  style,
}) => {
  // Vars
  const [newValue, setNewValue] = useState<OptionType>();
  const [colors] = useGlobal<any>("colors");
  const [theme] = useGlobal<any>("theme");

  // Lifecycle
  useEffect(() => {
    setNewValue(find(options, (o) => o.value === value));
  }, [value, options]);

  // UI
  return (
    <label style={{ fontSize: ".75rem", lineHeight: 2 }} id="aria-label">
      {label}
      <Select
        placeholder={label}
        options={options}
        isClearable={clearable}
        isMulti={multi}
        value={newValue}
        onChange={(chosen) => {
          if (onChange) {
            if (Array.isArray(chosen)) {
              const val: string[] = [];
              const args: string[] = [];
              chosen.map((v) => {
                val.push(v.value);
                args.push(v.args);
              });

              onChange(val, args);
            } else {
              //@ts-ignore
              onChange(chosen.value || "");
            }
          }
        }}
        menuPortalTarget={document.body}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "white",
            zIndex: 9999,
          }),
          menuPortal: (styles) => ({ ...styles, zIndex: 9999 }),
          option: (styles, { isDisabled, isFocused, isSelected }) => {
            const color = colors.primary;
            return {
              ...styles,
              backgroundColor: isDisabled
                ? null
                : isSelected
                ? color.hex()
                : isFocused
                ? color.alpha(0.1).css()
                : null,
              color: isDisabled
                ? "#ccc"
                : isSelected
                ? chroma.contrast(color, "white") > 2
                  ? "white"
                  : "black"
                : color.hex(),
              cursor: isDisabled ? "not-allowed" : "default",

              ":active": {
                ...styles[":active"],
                backgroundColor:
                  !isDisabled &&
                  (isSelected ? color.hex() : color.alpha(0.3).css()),
              },
            };
          },

          singleValue: (styles, { data }) => ({
            ...styles,
          }),
        }}
      />
    </label>
  );
};

export default SelectInput;
