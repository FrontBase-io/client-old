import { AppContext } from "../../..";
import {
  LayoutItemType,
  ModelType,
  ObjectType,
} from "../../../../../Utils/Types";
import LayoutComponents from "./Components";

const LayoutComponent: React.FC<{
  layoutItem: LayoutItemType;
  context: AppContext;
  model: ModelType;
  object: ObjectType;
}> = ({ layoutItem, context, model, object }) => {
  if (!LayoutComponents[layoutItem.type])
    return <>Layout component {layoutItem.type} doesn't exist</>;
  const Component = LayoutComponents[layoutItem.type];
  return (
    <Component
      context={context}
      layoutItem={layoutItem}
      model={model}
      object={object}
    >
      {layoutItem.items?.map((subLayoutItem, subLayoutItemIndex) => (
        <LayoutComponent
          context={context}
          layoutItem={subLayoutItem}
          model={model}
          object={object}
        />
      ))}
    </Component>
  );
};

export default LayoutComponent;
