import { Grid } from "@mui/material";
import InterfaceLayoutItem from ".";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
  LayoutItemType,
} from "../../../../../../Utils/Types";

const InterfaceCard: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVars: (vars: { [key: string]: InterfaceobjectVariableType }) => void;
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject, setVars }) => {
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
          setVars={setVars}
        />
      ))}
    </context.UI.Design.Card>
  );
};

export default InterfaceCard;
