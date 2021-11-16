import { useEffect, useState } from "react";
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
  const [label, setLabel] = useState<string>();
  // Lifecycle
  useEffect(() => {
    layoutItem.args?.label._form
      ? context.utils
          .parseFormula(layoutItem.args?.label._form, variables)
          .then((result) => setLabel(result))
      : setLabel(layoutItem.args?.label);
  }, [variables, context.utils.parseFormula]);

  // UI

  return (
    <context.UI.Design.Card
      title={label}
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
