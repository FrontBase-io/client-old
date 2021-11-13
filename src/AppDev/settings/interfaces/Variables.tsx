import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
  SelectOptionType,
} from "../../../Utils/Types";

const InterfaceVariables: React.FC<{
  context: AppContext;
  interfaceObject: InterfaceObjectType;
  onChange: (newVs: { [key: string]: InterfaceobjectVariableType }) => void;
}> = ({ context, interfaceObject, onChange }) => {
  // Vars
  const [modelList, setModelList] = useState<SelectOptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    context.data.models.getAll((models) => {
      setModelList(
        models.map((o) => {
          return { label: o.label_plural, value: o.key };
        })
      );
    });
  }, [context.data.models]);

  // UI
  return (
    <List disablePadding>
      {map(interfaceObject.variables, (v, vKey) => (
        <ListItem
          button
          key={vKey}
          onClick={() =>
            context.canvas.interact.dialog({
              display: true,
              title: "Add variable",
              fields: {
                label: {
                  label: "Label",
                  linkToKeyField: "key",
                  width: 6,
                  value: v.label,
                },
                key: { label: "Key", type: "key", width: 6, value: vKey },
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
                  value: v.type,
                },
                model: {
                  label: "Model",
                  type: "options",
                  options: modelList,
                  onlyDisplayWhen: {
                    or: [{ type: "object" }, { type: "objects" }],
                  },
                  value: v.model,
                },
              },
              actions: [
                {
                  label: "Add",
                  onClick: (form, close) => {
                    onChange({
                      ...interfaceObject.variables,
                      [form.key]: {
                        label: form.label,
                        key: form.key,
                        type: form.type,
                        model: form.model,
                      },
                    });
                    close();
                  },
                },
              ],
            })
          }
        >
          <ListItemText
            primary={v.label}
            secondary={
              v.type === "object" || v.type === "objects"
                ? `${v.type}: ${v.model}`
                : v.type
            }
          />
        </ListItem>
      ))}
      <Divider />
      <ListItem
        button
        onClick={() =>
          context.canvas.interact.dialog({
            display: true,
            title: "Add variable",
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
              },
              model: {
                label: "Model",
                type: "options",
                options: modelList,
                onlyDisplayWhen: {
                  or: [{ type: "object" }, { type: "objects" }],
                },
              },
            },
            actions: [
              {
                label: "Add",
                onClick: (form, close) => {
                  onChange({
                    ...interfaceObject.variables,
                    [form.key]: {
                      label: form.label,
                      key: form.key,
                      type: form.type,
                      model: form.model,
                    },
                  });
                  close();
                },
              },
            ],
          })
        }
      >
        <ListItemText>New variable</ListItemText>
      </ListItem>
    </List>
  );
};

export default InterfaceVariables;
