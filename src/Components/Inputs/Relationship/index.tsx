import { Typography } from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";
import { ModelType, ObjectType, SelectOptionType } from "../../../Utils/Types";
import { AppContext } from "../../Context";
import Select from "react-select";
import { filter } from "lodash";

const RelationshipInput: React.FC<{
  context: AppContext;
  object?: ObjectType;
  modelKey: string;
  model?: ModelType;
  label: string;
  value: string | string[];
  onChange?: (value?: string | string[], args?: string | string[]) => void;
  disabled?: true | boolean;
  clearable?: true;
  multi?: true;
  style?: CSSProperties;
  autoFocus?: boolean;
}> = ({
  context,
  label,
  modelKey,
  model,
  value,
  onChange,
  disabled,
  clearable,
  multi,
  style,
  autoFocus,
}) => {
  // Vars
  const [isLoading, setIsLoading] = useState<any>(true);
  const [options, setOptions] = useState<SelectOptionType[]>();
  const [appliedModel, setAppliedModel] = useState<ModelType>();

  // Lifecycle
  useEffect(() => {
    if (model) {
      setAppliedModel(model);
    } else {
      context.data.models.get(modelKey, (model) => setAppliedModel(model));
    }
  }, [context.data.models, model, modelKey]);
  useEffect(() => {
    if (appliedModel) {
      context.data.objects.get(appliedModel.key, {}, (objects) => {
        const newOptions: SelectOptionType[] = [];
        objects.map((o) =>
          newOptions.push({ label: o[appliedModel.primary], value: o._id })
        );
        setIsLoading(false);
        setOptions(newOptions);
      });
    }
  }, [context.data.objects, appliedModel]);
  // UI
  return (
    <label style={{ fontSize: ".75rem", lineHeight: 2 }} id="aria-label">
      <Typography variant="caption">{label}</Typography>

      <Select
        isLoading={isLoading}
        options={options}
        isMulti={multi}
        value={
          Array.isArray(value)
            ? filter(options, (o) => value.includes(o.value))
            : filter(options, (o) => o.value === value)[0]
        }
        onChange={(selected) => {
          if (onChange) {
            if (multi) {
              const toReturn: string[] = [];
              selected.map((s) => toReturn.push(s.value));
              onChange(toReturn);
            } else {
              //@ts-ignore
              onChange(selected?.value || "");
            }
          }
        }}
      />
    </label>
  );
};

export default RelationshipInput;
