import { useState } from "react";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
  LayoutItemType,
} from "../../../../../../Utils/Types";
import executeInterfaceActions from "../executeInterfaceAction";

const InterfaceInputText: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVars: (vars: { [key: string]: InterfaceobjectVariableType }) => void;
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject, setVars }) => {
  // Vars
  const [value, setValue] = useState<string>("");
  // Lifecycle

  // UI

  return (
    <context.UI.Inputs.Text
      label={layoutItem.args?.label}
      placeholder={layoutItem.args?.placeholder}
      value={value}
      onChange={setValue}
      onEnter={
        layoutItem.args?.onEnter
          ? () => {
              executeInterfaceActions(
                context,
                layoutItem.args?.onEnter,
                {
                  ...vars,
                  currentInputValue: value,
                  currentInputKey: layoutItem.key,
                  setCurrentInputValue: setValue,
                },
                setVars
              );
            }
          : undefined
      }
    />
  );
};

export default InterfaceInputText;
