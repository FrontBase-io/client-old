import { useState } from "react";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
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
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject }) => {
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
              executeInterfaceActions(context, layoutItem.args?.onEnter, {
                ...vars,
                currentInputValue: value,
                currentInputKey: layoutItem.key,
              });
            }
          : undefined
      }
    />
  );
};

export default InterfaceInputText;
