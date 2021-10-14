import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
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
          <ListItem key={key}>
            <ListItemText>{variable.label}</ListItemText>
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
            },
          })
        }
      >
        <ListItemText>Create</ListItemText>
      </ListItem>
    </List>
  );
};

export default ProcessVariables;
