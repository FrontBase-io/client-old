import React, { FunctionComponent } from "react";
import { AppContext } from "../../../../Components/Context";
import FourOhFour from "../../../../Components/FourOhFour";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
  ModelType,
  SelectOptionType,
} from "../../../../Utils/Types";
import ComponentPreviewCard from "./Card";
import ComponentPreviewGridContainer from "./GridContainer";
import ComponentPreviewGridItem from "./GridItem";
import ComponentPreviewInputBoolean from "./InputBoolean";
import ComponentPreviewInputText from "./InputText";
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
    modelListOptions: SelectOptionType[];
  }>;
} = {
  ListDetailLayout: ComponentPreviewListDetailLayout,
  List: ComponentListPreview,
  ObjectLayout: ComponentPreviewObjectLayout,
  GridContainer: ComponentPreviewGridContainer,
  GridItem: ComponentPreviewGridItem,
  InputText: ComponentPreviewInputText,
  InputBoolean: ComponentPreviewInputBoolean,
  Card: ComponentPreviewCard,
};

const LayoutItemComponent: React.FC<{
  layoutItem: LayoutItemType;
  context: AppContext;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
  modelList: ModelType[];
  modelListOptions: SelectOptionType[];
}> = ({
  layoutItem,
  context,
  layout,
  setLayout,
  variables,
  modelList,
  modelListOptions,
}) => {
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
      modelListOptions={modelListOptions}
    />
  );
};

export default LayoutItemComponent;
