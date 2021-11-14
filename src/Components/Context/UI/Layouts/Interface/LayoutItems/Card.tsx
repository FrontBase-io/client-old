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
  variables: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVariables: (variables: {
    [key: string]: InterfaceobjectVariableType;
  }) => void;
}> = ({
  variables,
  layoutItem,
  context,
  baseUrl,
  interfaceObject,
  setVariables,
}) => {
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
          variables={variables}
          baseUrl={baseUrl}
          interfaceObject={interfaceObject}
          setVariables={setVariables}
        />
      ))}
    </context.UI.Design.Card>
  );
};

export default InterfaceCard;
