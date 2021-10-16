import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import Icon from "../../../Components/Design/Icon";
import { ProcessVariableType, SelectOptionType } from "../../../Utils/Types";

const ProcessVariables: React.FC<{
  context: AppContext;
  value?: { [key: string]: ProcessVariableType };
  onChange: (newValue: { [key: string]: ProcessVariableType }) => void;
}> = ({ context, value, onChange }) => {
  // Vars
  const [modelList, setModelList] = useState<SelectOptionType[]>();

  // Lifecycle
  useEffect(() => {
    // Fetch object list
    context.data.models.getAll((models) => {
      setModelList(
        context.utils.listifyForSelect(models, "label_plural", "key")
      );
    });
  }, []);

  // UI
  return (
    <List disablePadding>
      {Object.keys(value || {}).length > 0 ? (
        map(value, (variable, key) => (
          <ListItem key={key} button>
            <ListItemIcon>
              <Icon
                icon={
                  {
                    text: "font",
                    number: "sort-numeric-down",
                    boolean: "toggle-off",
                    object: "cube",
                    objects: "cubes",
                  }[variable.type] || "error"
                }
              />
            </ListItemIcon>
            <ListItemText primary={variable.label} secondary={variable.type} />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText>No variables</ListItemText>
        </ListItem>
      )}
      <Divider />
      <ListItem
        button
        onClick={() =>
          context.canvas.interact.dialog({
            display: true,
            title: "Create variable",
            fields: {
              label: { label: "Label", linkToKeyField: "key", width: 6 },
              key: { label: "Key", type: "key", width: 6 },
              type: {
                label: "Type",
                type: "options",
                options: [
                  { label: "Text", value: "text" },
                  { label: "Number", value: "number" },
                  { label: "Boolean", value: "boolean" },
                  { label: "Object", value: "object" },
                  { label: "Objects", value: "objects" },
                ],
                value: "text",
              },
              recordModel: {
                label: "Model",
                type: "options",
                options: modelList,
                onlyDisplayWhen: {
                  or: [{ type: "object" }, { type: "objects" }],
                },
              },
              isInput: {
                label: "Is input",
                type: "boolean",
                explanation:
                  "This variable can be supplied before the process starts.",
                onlyDisplayWhen: {
                  or: [
                    { type: "text" },
                    { type: "object" },
                    { type: "objects" },
                  ],
                },
                width: 6,
              },
              isOutput: {
                label: "Is output",
                type: "boolean",
                explanation:
                  "This variable will be output once the process is done. On a 'before save' trigger this will override the saved values. In other cases this can be used by different processes.",
                onlyDisplayWhen: {
                  or: [{ type: "object" }, { type: "objects" }],
                },
                width: 6,
              },
            },
            actions: [
              {
                label: "Create",
                onClick: (form, close) => {
                  onChange({
                    ...value,
                    [form.key]: {
                      label: form.label,
                      type: form.type,
                      recordModel: form.recordModel,
                      isInput: form.isInput,
                      isOutput: form.isOutput,
                    },
                  });
                  close();
                },
              },
            ],
          })
        }
      >
        <ListItemText>Create</ListItemText>
      </ListItem>
    </List>
  );
};

export default ProcessVariables;
