import { FunctionComponent } from "react";
import { AppContext } from "../../../..";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
} from "../../../../../../Utils/Types";
import FourOhFour from "../../../../../FourOhFour";
import InterfaceListDetailLayout from "./ListDetailLayout";

const Components: {
  [key: string]: FunctionComponent<{
    context: AppContext;
    layoutItem: LayoutItemType;
    layout: LayoutItemType[];
    vars: { [key: string]: InterfaceobjectVariableType };
    baseUrl: string;
  }>;
} = {
  ListDetailLayout: InterfaceListDetailLayout,
};

const InterfaceLayoutItem: React.FC<{
  layoutItem: LayoutItemType;
  context: AppContext;
  layout: LayoutItemType[];
  vars: { [key: string]: InterfaceobjectVariableType };
  baseUrl: string;
}> = ({ layoutItem, context, layout, vars, baseUrl }) => {
  // Vars
  const Component = Components[layoutItem.type]
    ? Components[layoutItem.type]
    : FourOhFour;

  // UI
  return (
    <Component
      context={context}
      layoutItem={layoutItem}
      layout={layout}
      vars={vars}
      baseUrl={baseUrl}
    />
  );
};

export default InterfaceLayoutItem;
