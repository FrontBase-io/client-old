import { Grid } from "@mui/material";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  LayoutItemType,
} from "../../../../../../Utils/Types";

const InterfaceCard: React.FC<{
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
    <context.UI.Design.Card
      title={layoutItem.args?.label}
      withoutMargin={layoutItem.args?.withoutMargin}
      withoutPadding={layoutItem.args?.withoutPadding}
    >
      {(layoutItem.items || []).map((childLayoutItem) => (
        <InterfaceLayoutItem
          context={context}
          layoutItem={childLayoutItem}
          layout={interfaceObject.layout!}
          vars={vars}
          baseUrl={baseUrl}
          interfaceObject={interfaceObject}
        />
      ))}
    </context.UI.Design.Card>
  );
};

export default InterfaceCard;
