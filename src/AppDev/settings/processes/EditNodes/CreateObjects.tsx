import { Grid } from "@mui/material";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import {
  ModelType,
  ProcessObjectType,
  SelectOptionType,
} from "../../../../Utils/Types";

const EditCreateObjectsNode: React.FC<{
  value: { toCreate: string[] };
  onChange: (newVal: {}) => void;
  process: ProcessObjectType;
  context: AppContext;
  models: ModelType[];
}> = ({ value, onChange, process, context, models }) => {
  // Vars
  const [options, setOptions] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    const newOptions: SelectOptionType[] = [];
    map(process.variables || {}, (v, k) => {
      if (!Object.keys(value).includes(k)) {
        newOptions.push({ label: v.label, value: k });
      }
    });
    setOptions(newOptions);
  }, [process, value]);

  // UI
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        This node saves a variable as a new object to the database.
      </Grid>
      <Grid item xs={12}>
        <context.UI.Inputs.Select
          options={options}
          label="Create these objects"
          value={value.toCreate || []}
          multi
          onChange={(toCreate) => onChange({ ...value, toCreate })}
        />
      </Grid>
    </Grid>
  );
};

export default EditCreateObjectsNode;
