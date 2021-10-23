import React, { useState, useEffect, CSSProperties } from "react";
import Select from "react-select";
import find from "lodash/find";
import { useGlobal } from "reactn";
import chroma from "chroma-js";

interface OptionType {
  label: string;
  value: string;
}

const SelectInput: React.FC<{
  label: string;
  value?: string | string[];
  options: OptionType[];
  onChange?: (value: string | string[], args?: string | string[]) => void;
  disabled?: true | boolean;
  clearable?: true;
  multi?: true;
  style?: CSSProperties;
  autoFocus?: boolean;
}> = ({
  label,
  value,
  onChange,
  disabled,
  options,
  clearable,
  multi,
  style,
  autoFocus,
}) => {
  // Vars
  const [newValue, setNewValue] = useState<OptionType | OptionType[]>();
  const [colors] = useGlobal<any>("colors");
  const [theme] = useGlobal<any>("theme");

  // Lifecycle
  useEffect(() => {
    if (multi) {
      const nv: OptionType[] = [];
      (value as string[]).map((v) =>
        nv.push(find(options, (o) => o.value === v) as OptionType)
      );
      setNewValue(nv);
    } else {
      setNewValue(find(options, (o) => o.value === value));
    }
  }, [value, options, multi]);

  // UI
  return (
    <label style={{ fontSize: ".75rem", lineHeight: 2 }} id="aria-label">
      {label}
      <Select
        placeholder={label}
        options={options}
        isClearable={clearable}
        isMulti={multi}
        autoFocus={autoFocus}
        value={newValue}
        style={style}
        onChange={(chosen) => {
          if (onChange) {
            if (Array.isArray(chosen)) {
              const val: string[] = [];
              const args: string[] = [];
              // eslint-disable-next-line array-callback-return
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
            backgroundColor:
              theme.palette.mode === "dark" ? "#323232" : "white",
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
            color: theme.palette.mode === "dark" ? "white" : "#323232",
          }),
        }}
      />
    </label>
  );
};

export default SelectInput;
