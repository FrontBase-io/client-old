import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { map } from "lodash";

import { AppContext } from "../../../Components/Context";
import {
  InterfaceobjectActionType,
  InterfaceObjectType,
} from "../../../Utils/Types";
import ActionDesigner from "./ActionDesigner";

const InterfaceActions: React.FC<{
  context: AppContext;
  interfaceObject: InterfaceObjectType;
  onChange: (newAs: { [key: string]: InterfaceobjectActionType }) => void;
}> = ({ context, interfaceObject, onChange }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <List disablePadding>
      {map(interfaceObject.actions, (action, aKey) => (
        <ListItem
          button
          key={aKey}
          onClick={() =>
            context.canvas.interact.dialog({
              display: true,
              title: "Modify action",
              size: "xl",
              fields: {
                label: {
                  label: "Label",
                  linkToKeyField: "key",
                  width: 9,
                  value: action.label,
                },
                key: { label: "Key", type: "key", width: 3, value: aKey },
                actions: {
                  label: "Actions",
                  type: "custom",
                  component: ActionDesigner,
                  value: action.actions || [],
                },
              },
              actions: [
                {
                  label: "Update",
                  onClick: (form, close) => {
                    console.log(form);
                    close();
                  },
                },
              ],
            })
          }
        >
          <ListItemText primary={action.label} secondary={action.description} />
        </ListItem>
      ))}
      <Divider />
      <ListItem
        button
        onClick={() =>
          context.canvas.interact.dialog({
            display: true,
            size: "sm",
            title: "Create action",
            text: "An action can be triggered by the UI and performs various actions.",
            fields: {
              label: { label: "Label", linkToKeyField: "key", width: 8 },
              key: { label: "Key", type: "key", width: 4 },
              description: { label: "Description" },
            },
            actions: [
              {
                label: "Add",
                onClick: (form, close) => {
                  onChange({
                    ...interfaceObject.actions,
                    [form.key]: {
                      label: form.label,
                      description: form.description,
                      actions: [
                        {
                          id: "input",
                          type: "input",
                          data: {
                            label: "Start",
                          },
                          position: { x: 100, y: 0 },
                        },
                        {
                          id: "output",
                          type: "output",
                          data: {
                            label: "End",
                          },
                          position: { x: 100, y: 480 },
                        },
                      ],
                    },
                  });
                  close();
                },
              },
            ],
          })
        }
      >
        <ListItemText>New action</ListItemText>
      </ListItem>
    </List>
  );
};

export default InterfaceActions;
