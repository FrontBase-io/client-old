import { Button } from "@mui/material";
import { AppContext } from "../../../../Components/Context";
import {
  InterfaceobjectActionType,
  InterfaceobjectVariableType,
  SelectOptionType,
} from "../../../../Utils/Types";
import InterfaceActionDesigner from "../ActionDesigner";

const ActionDesignerLauncher: React.FC<{
  context: AppContext;
  value?: { description?: string; actions: InterfaceobjectActionType };
  onChange: (newVal: {
    description?: string;
    actions: InterfaceobjectActionType;
  }) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelListOptions: SelectOptionType[];
}> = ({ context, value, onChange, variables, modelListOptions }) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <Button
      onClick={() =>
        context.canvas.interact.dialog({
          display: true,
          title: "Assign action",
          size: "xl",
          fields: {
            description: { label: "Description", value: value?.description },
            actions: {
              label: "Actions",
              type: "custom",
              component: InterfaceActionDesigner,
              componentProps: { variables, modelListOptions },
              value: value?.actions,
            },
          },
          actions: [
            {
              label: "Assign",
              onClick: (form, close) => {
                onChange({
                  description: form.description,
                  actions: form.actions,
                });
                close();
              },
            },
          ],
        })
      }
    >
      {value ? "Edit assigned action" : "Assign action"}
    </Button>
  );
};

export default ActionDesignerLauncher;
