import { Button, Divider, Grid, Typography } from "@mui/material";
import { map } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { ProcessObjectType, SelectOptionType } from "../../../../Utils/Types";

const EditAssignValuesNode: React.FC<{
  value: {};
  onChange: (newVal: {}) => void;
  process: ProcessObjectType;
  context: AppContext;
}> = ({ value, onChange, process, context }) => {
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
      {map(value, (value, key) => {
        const v = (process.variables || {})[key] || {
          label: "Unknown variable",
        };

        return (
          <Grid item xs={12} key={key}>
            {v.type === "object" ? (
              "object"
            ) : v.type === "objects" ? (
              <context.UI.Layouts.ObjectDesigner context={context} />
            ) : (
              <Grid container>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">{v.label}</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ fontWeight: "lighter" }}
                  >
                    {v.type}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  Equals
                </Grid>
                <Grid item xs={6}>
                  Set value to
                </Grid>
              </Grid>
            )}
          </Grid>
        );
      })}
      <Divider />
      {options.length > 0 && (
        <Grid item xs={12}>
          <Typography>Click the buttons to assign a variable</Typography>
          {options.map((v) => (
            <Button
              key={v.value}
              onClick={() => onChange({ ...value, [v.value]: null })}
              color="primary"
              variant="outlined"
            >
              {v.label}
            </Button>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default EditAssignValuesNode;
