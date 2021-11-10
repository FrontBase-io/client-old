import React, { FunctionComponent } from "react";
import { AppContext } from "../../../../Components/Context";
import FourOhFour from "../../../../Components/FourOhFour";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
} from "../../../../Utils/Types";
import ComponentPreviewGridContainer from "./GridContainer";
import ComponentListPreview from "./List";
import ComponentPreviewListDetailLayout from "./ListDetailLayout";
import ComponentPreviewObjectLayout from "./ObjectLayout";

const Components: {
  [key: string]: FunctionComponent<{
    context: AppContext;
    layoutItem: LayoutItemType;
    layout: LayoutItemType[];
    setLayout: (layout: LayoutItemType[]) => void;
    variables: { [key: string]: InterfaceobjectVariableType };
    modelList: ModelType[];
  }>;
} = {
  ListDetailLayout: ComponentPreviewListDetailLayout,
  List: ComponentListPreview,
  ObjectLayout: ComponentPreviewObjectLayout,
  GridContainer: ComponentPreviewGridContainer,
};

const LayoutItemComponent: React.FC<{
  layoutItem: LayoutItemType;
  context: AppContext;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelList: ModelType[];
}> = ({ layoutItem, context, layout, setLayout, variables, modelList }) => {
  const Component = Components[layoutItem.type]
    ? Components[layoutItem.type]
    : FourOhFour;
  return (
    <Component
      context={context}
      layoutItem={layoutItem}
      layout={layout}
      setLayout={setLayout}
      variables={variables}
      modelList={modelList}
    />
  );
};

export default LayoutItemComponent;
