import { FunctionComponent } from "react";
import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  InterfaceobjectVariableType,
  LayoutItemType,
} from "../../../../../../Utils/Types";
import FourOhFour from "../../../../../FourOhFour";
import InterfaceCard from "./Card";
import InterfaceGridContainer from "./GridContainer";
import InterfaceGridItem from "./GridItem";
import InterfaceInputBoolean from "./InputBoolean";
import InterfaceInputText from "./InputText";
import InterfaceList from "./List";
import InterfaceListDetailLayout from "./ListDetailLayout";
import InterfaceObjectLayout from "./ObjectLayout";

const Components: {
  [key: string]: FunctionComponent<{
    context: AppContext;
    layoutItem: LayoutItemType;
    layout: LayoutItemType[];
    variables: { [key: string]: InterfaceobjectVariableType };
    baseUrl: string;
    interfaceObject: InterfaceObjectType;
    setVariables: (variables: {
      [key: string]: InterfaceobjectVariableType;
    }) => void;
  }>;
} = {
  ListDetailLayout: InterfaceListDetailLayout,
  List: InterfaceList,
  ObjectLayout: InterfaceObjectLayout,
  GridContainer: InterfaceGridContainer,
  GridItem: InterfaceGridItem,
  Card: InterfaceCard,
  InputText: InterfaceInputText,
  InputBoolean: InterfaceInputBoolean,
};

const InterfaceLayoutItem: React.FC<{
  layoutItem: LayoutItemType;
  context: AppContext;
  layout: LayoutItemType[];
  variables: { [key: string]: InterfaceobjectVariableType };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVariables: (variables: {
    [key: string]: InterfaceobjectVariableType;
  }) => void;
}> = ({
  layoutItem,
  context,
  layout,
  variables,
  baseUrl,
  interfaceObject,
  setVariables,
}) => {
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
      variables={variables}
      baseUrl={baseUrl}
      interfaceObject={interfaceObject}
      setVariables={setVariables}
    />
  );
};

export default InterfaceLayoutItem;
