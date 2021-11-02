import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { map } from "lodash";
import { AppContext } from "../../../Components/Context";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
} from "../../../Utils/Types";

const InterfaceVariables: React.FC<{
  context: AppContext;
  interfaceObject: InterfaceObjectType;
  onChange: (newVs: { [key: string]: InterfaceobjectVariableType }) => void;
}> = ({ context, interfaceObject, onChange }) => {
  // UI
  return (
    <List disablePadding>
      {map(interfaceObject.variables, (v, vKey) => (
        <ListItem button key={vKey}>
          <ListItemText>{v.label}</ListItemText>
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
              label: { label: "Label", linkToKeyField: "key" },
              key: { label: "Key", type: "key" },
              type: {
                label: "Type",
                type: "options",
                options: [{ label: "Objects", value: "objects" }],
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
