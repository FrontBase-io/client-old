import { useState } from "react";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
  LayoutItemType,
} from "../../../../../../Utils/Types";
import executeInterfaceActions from "../executeInterfaceAction";

const InterfaceInputBoolean: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  variables: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVariables: (vars: { [key: string]: InterfaceobjectVariableType }) => void;
}> = ({
  variables,
  layoutItem,
  context,
  baseUrl,
  interfaceObject,
  setVariables,
}) => {
  // Vars
  const [value, setValue] = useState<boolean>(false);
  // Lifecycle

  // UI

  return (
    <context.UI.Inputs.Boolean
      label={layoutItem.args?.label}
      value={value}
      withoutPropagation
      onChange={(val) => {
        setValue(val);
        if (layoutItem.args?.onChange) {
          executeInterfaceActions(
            context,
            layoutItem.args?.onChange,
            {
              ...variables,
              currentInputValue: val,
              currentInputKey: layoutItem.key,
              setCurrentInputValue: setValue,
            },
            setVariables
          ).then(
            () => {},
            (reason) => context.canvas.interact.snackbar(reason, "error")
          );
        }
      }}
    />
  );
};

export default InterfaceInputBoolean;
