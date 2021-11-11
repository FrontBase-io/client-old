import { Grid } from "@mui/material";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  LayoutItemType,
} from "../../../../../../Utils/Types";

const InterfaceInputText: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject }) => {
  // Vars

  // Lifecycle

  // UI

  return (
    <context.UI.Inputs.Text
      label={layoutItem.args?.label}
      placeholder={layoutItem.args?.placeholder}
    />
  );
};

export default InterfaceInputText;
