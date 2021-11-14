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
                  ...variables,
                  currentInputValue: value,
                  currentInputKey: layoutItem.key,
                  setCurrentInputValue: setValue,
                },
                setVariables
              );
            }
          : undefined
      }
    />
  );
};

export default InterfaceInputText;
