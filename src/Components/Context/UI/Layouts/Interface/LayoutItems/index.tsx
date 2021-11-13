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
import InterfaceInputText from "./InputText";
import InterfaceList from "./List";
import InterfaceListDetailLayout from "./ListDetailLayout";
import InterfaceObjectLayout from "./ObjectLayout";

const Components: {
  [key: string]: FunctionComponent<{
    context: AppContext;
    layoutItem: LayoutItemType;
    layout: LayoutItemType[];
    vars: { [key: string]: InterfaceobjectVariableType };
    baseUrl: string;
    interfaceObject: InterfaceObjectType;
    setVars: (vars: { [key: string]: InterfaceobjectVariableType }) => void;
  }>;
} = {
  ListDetailLayout: InterfaceListDetailLayout,
  List: InterfaceList,
  ObjectLayout: InterfaceObjectLayout,
  GridContainer: InterfaceGridContainer,
  GridItem: InterfaceGridItem,
  Card: InterfaceCard,
  InputText: InterfaceInputText,
};

const InterfaceLayoutItem: React.FC<{
  layoutItem: LayoutItemType;
  context: AppContext;
  layout: LayoutItemType[];
  vars: { [key: string]: InterfaceobjectVariableType };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
  setVars: (vars: { [key: string]: InterfaceobjectVariableType }) => void;
}> = ({
  layoutItem,
  context,
  layout,
  vars,
  baseUrl,
  interfaceObject,
  setVars,
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
      vars={vars}
      baseUrl={baseUrl}
      interfaceObject={interfaceObject}
      setVars={setVars}
    />
  );
};

export default InterfaceLayoutItem;
