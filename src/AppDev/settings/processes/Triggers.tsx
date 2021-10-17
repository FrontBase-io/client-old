import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { filter, findLast } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import {
  ModelType,
  ProcessObjectType,
  ProcessTriggersType,
  SelectOptionType,
} from "../../../Utils/Types";

const ProcessTriggers: React.FC<{
  context: AppContext;
  process: ProcessObjectType;
  models: ModelType[];
  onChange: (newTriggers: ProcessTriggersType) => void;
}> = ({ context, process, models, onChange }) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <>
      <List disablePadding>
        {process.triggers?.beforeChange && (
          <>
            <ListSubheader>Before change</ListSubheader>
            {process.triggers.beforeChange.map((trigger, triggerIndex) => (
              <ListItem key={`beforeChangeTrigger-${triggerIndex}`} button>
                <ListItemText>{trigger.label}</ListItemText>
              </ListItem>
            ))}
          </>
        )}
        <Divider />
        <ListItem
          button
          onClick={() =>
            context.canvas.interact.dialog({
              display: true,
              title: "Create new trigger",
              size: "sm",
              fields: {
                newTrigger: {
                  label: "New trigger",
                  type: "custom",
                  component: NewTriggerInputType,
                  componentProps: { models, process },
                },
              },
              actions: [
                {
                  label: "Create trigger",
                  onClick: (form, close) => {
                    switch (form.newTrigger.type) {
                      case "beforeChange":
                        onChange({
                          ...process.triggers,
                          beforeChange: [
                            ...(process.triggers?.beforeChange || []),
                            {
                              label: form.newTrigger.label,
                              modelKey: form.newTrigger.modelKey,
                              fields: form.newTrigger.fields,
                              oldObject: form.newTrigger.oldObject,
                              newObject: form.newTrigger.newObject,
                              output: form.newTrigger.output,
                              operations: form.newTrigger.operations,
                            },
                          ],
                        });
                        break;
                      default:
                        context.canvas.interact.snackbar(
                          `Unknown trigger ${form.newTrigger.type}`,
                          "error"
                        );
                        break;
                    }
                    close();
                  },
                },
              ],
            })
          }
        >
          Create trigger
        </ListItem>
      </List>
    </>
  );
};

export default ProcessTriggers;

const NewTriggerInputType: React.FC<{
  value: {
    label: string;
    type: string;
    // Change
    modelKey?: string;
    fields?: string[];
    oldObject?: string;
    newObject?: string;
    output?: string;
    operations?: string[];
  };
  onChange: (newValue: {}) => void;
  context: AppContext;
  models: ModelType[];
  process: ProcessObjectType;
}> = ({ value, onChange, context, models, process }) => {
  // Vars
  const [modelList, setModelList] = useState<SelectOptionType[]>([]);
  const [fieldOptions, setFieldOptions] = useState<SelectOptionType[]>([]);
  const [variableList, setVariableList] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    setModelList(context.utils.listifyForSelect(models, "label", "key"));
  }, [context.utils, models]);
  useEffect(() => {
    if (value.modelKey) {
      const model = findLast(
        models,
        (o: ModelType) => o.key === value.modelKey
      );
      setFieldOptions(
        context.utils.listifyObjectForSelect(model?.fields || {}, "label")
      );
    }
    setVariableList(
      context.utils.listifyObjectForSelect(process.variables || {}, "label")
    );
  }, [context.utils, models, process.variables, value.modelKey]);
  // UI
  return (
    <>
      <context.UI.Inputs.Text
        label="Label"
        value={value.label}
        onChange={(label) => onChange({ ...value, label })}
      />
      <context.UI.Inputs.Select
        label="Trigger type"
        options={[
          { label: "Before change", value: "beforeChange" },
          { label: "After change", value: "afterChange" },
          { label: "Time based", value: "time" },
          { label: "Global action", value: "globalAction" },
          { label: "Single action", value: "singleAction" },
          { label: "Many action", value: "manyAction" },
        ]}
        value={value.type}
        onChange={(newVal) => onChange({ ...value, type: newVal as string })}
      />
      {value.type === "beforeChange" && (
        <context.UI.Design.Card
          title="Before change trigger"
          withoutMargin
          style={{ marginTop: 15 }}
        >
          <Typography variant="body2">
            This trigger fires before a change can be made by a user. It is
            efficient in the sense that it modifies the change before saving it
            to the database. It comes with the variables oldObject and newObject
            as inputs. The process is supposed to return a variable as output.
            That variable will be saved. The process will be ran as the user
            saving the object.
          </Typography>
          <context.UI.Inputs.Options
            label="What operations?"
            options={[
              { label: "Insert", value: "insert" },
              { label: "Update", value: "update" },
              { label: "Delete", value: "delete" },
            ]}
            mode="checkbox"
            value={value.operations}
            onChange={(operations) =>
              onChange({ ...value, operations: operations as string[] })
            }
          />
          <context.UI.Inputs.Select
            label="Model"
            value={value.modelKey}
            onChange={(modelKey) =>
              onChange({ ...value, modelKey: modelKey as string })
            }
            options={modelList}
          />
          {value.modelKey && (
            <>
              <context.UI.Inputs.Select
                multi
                label="Fields"
                value={value.fields || []}
                options={fieldOptions}
                onChange={(selectedFields) =>
                  onChange({ ...value, fields: selectedFields as string[] })
                }
              />
              <context.UI.Inputs.Select
                label="Input variable (newObject)"
                value={value.newObject || ""}
                options={filter(
                  variableList,
                  (o) =>
                    (o.object?.type === "object" ||
                      o.object?.type === "objects") &&
                    o.object.recordModel === value.modelKey &&
                    o.object.isInput === true
                )}
                onChange={(newObject) =>
                  onChange({ ...value, newObject: newObject as string })
                }
              />
              <context.UI.Inputs.Select
                label="Input variable (oldObject)"
                value={value.oldObject || ""}
                options={filter(
                  variableList,
                  (o) =>
                    (o.object?.type === "object" ||
                      o.object?.type === "objects") &&
                    o.object.recordModel === value.modelKey &&
                    o.object.isInput === true
                )}
                onChange={(oldObject) =>
                  onChange({ ...value, oldObject: oldObject as string })
                }
              />
              <context.UI.Inputs.Select
                label="Output variable"
                value={value.output || ""}
                options={filter(
                  variableList,
                  (o) =>
                    (o.object?.type === "object" ||
                      o.object?.type === "objects") &&
                    o.object.recordModel === value.modelKey &&
                    o.object.isOutput === true
                )}
                onChange={(output) =>
                  onChange({ ...value, output: output as string })
                }
              />
            </>
          )}
        </context.UI.Design.Card>
      )}
    </>
  );
};
