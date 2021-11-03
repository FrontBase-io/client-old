import React, { FunctionComponent } from "react";
import { AppContext } from "../../../../Components/Context";
import FourOhFour from "../../../../Components/FourOhFour";
import {
  InterfaceobjectVariableType,
  LayoutItemType,
} from "../../../../Utils/Types";
import ComponentListPreview from "./List";
import ComponentPreviewListDetailLayout from "./ListDetailLayout";

const Components: {
  [key: string]: FunctionComponent<{
    context: AppContext;
    layoutItem: LayoutItemType;
    layout: LayoutItemType[];
    setLayout: (layout: LayoutItemType[]) => void;
    variables: { [key: string]: InterfaceobjectVariableType };
  }>;
} = {
  ListDetailLayout: ComponentPreviewListDetailLayout,
  List: ComponentListPreview,
};

const LayoutItemComponent: React.FC<{
  layoutItem: LayoutItemType;
  context: AppContext;
  layout: LayoutItemType[];
  setLayout: (layout: LayoutItemType[]) => void;
  variables: { [key: string]: InterfaceobjectVariableType };
}> = ({ layoutItem, context, layout, setLayout, variables }) => {
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
    />
  );
};

export default LayoutItemComponent;
