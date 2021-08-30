import { Button, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { ModelType, SelectOptionType } from "../../../Utils/Types";
import { AppContext } from "../../Context";
import Typography from "@material-ui/core/Typography";
import { map } from "lodash";

const FormulaDesigner: React.FC<{
  context: AppContext;
  startModel: string;
  value: string;
  onChange: (result: string) => void;
}> = ({ context, startModel, value, onChange }) => {
  // Vars
  const [models, setModels] = useState<{ [key: string]: ModelType }>();

  // Lifecycle
  useEffect(() => {
    context.data.models.getAll((modelData) =>
      setModels(context.utils.modelListToModelObject(modelData))
    );
  }, []);

  // UI
  if (!models) return <context.UI.Loading />;
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6">Formula</Typography>
        <Button
          color="primary"
          onClick={() =>
            context.canvas.interact.dialog({
              display: true,
              title: "Add field",
              fields: {
                formula: {
                  label: "Formula",
                  type: "custom",
                  component: PopupContent,
                  componentProps: { models, startModel },
                },
              },
              actions: [
                {
                  label: "Insert",
                  onClick: (form, close) => {
                    onChange((value || "") + form.formula);
                    close();
                  },
                },
              ],
            })
          }
        >
          Add field
        </Button>
      </Grid>
      <Grid item xs={12}>
        <context.UI.Inputs.Text
          label="Formula"
          mode="textarea"
          value={value}
          onChange={(value) => onChange(value)}
        />
      </Grid>
    </Grid>
  );
};

export default FormulaDesigner;

const PopupContent: React.FC<{
  context: AppContext;
  models: { [key: string]: ModelType };
  startModel: string;
  value: string;
  onChange: (newValue: string) => void;
}> = ({ context, models, startModel, value, onChange }) => {
  // Vars
  const [values, setValues] = useState<string[]>([""]);
  const [modelKeys, setModelKeys] = useState<string[]>([startModel]);

  // Lifecycle
  // UI
  return (
    <>
      {value}
      <br />
      <Grid container spacing={2}>
        {values.map((v, index) => (
          <Grid
            item
            //@ts-ignore
            xs={12 / values.length}
            key={`item-${index}`}
          >
            <ModelFieldSelector
              context={context}
              models={models}
              modelKey={modelKeys[index]}
              value={values[index]}
              onChange={(value) => {
                const newValues = values;
                newValues[index] = value;

                if (value.match(/__r$/)) {
                  newValues.push("");
                  setModelKeys([
                    ...modelKeys,
                    models[modelKeys[index]].fields[value.replace("__r", "")]
                      .relationshipTo!,
                  ]);
                }
                setValues(newValues);

                let newFormula = "{{ ";
                newValues.map((v) => (newFormula += v + "."));
                newFormula =
                  newFormula.substr(0, newFormula.length - 1) + " }}";
                onChange(newFormula);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const ModelFieldSelector: React.FC<{
  context: AppContext;
  modelKey: string;
  models: { [key: string]: ModelType };
  value: string;
  onChange: (value: any) => void;
}> = ({ context, models, modelKey, onChange, value }) => {
  // Vars
  const [options, setOptions] = useState<SelectOptionType[]>();

  // Lifecycle
  useEffect(() => {
    // Convert fields to options and add a bonus (__r) option for each field that is a relationship
    const newOptions: SelectOptionType[] = [];
    map(models[modelKey].fields || {}, (field, key: string) => {
      if (field.type === "relationship") {
        newOptions.push({
          label: field["label"] + " (Relation) >",
          value: key + "__r",
        });
      }
      newOptions.push({
        label: field["label"],
        value: key,
      });
    });
    setOptions(newOptions);
  }, [models, modelKey]);

  // UI
  return (
    <context.UI.Inputs.Select
      label="Field"
      options={options || []}
      value={value}
      onChange={onChange}
    />
  );
};
