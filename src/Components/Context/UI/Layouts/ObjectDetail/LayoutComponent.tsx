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
  object?: ObjectType;
  newObject?: ObjectType;
  viewMode: "view" | "edit";
  selectedField?: string;
  selectField: (fieldName: string) => void;
  updateField: (key: string, newValue: any) => void;
}> = ({
  layoutItem,
  context,
  model,
  object,
  newObject,
  viewMode,
  selectField,
  selectedField,
  updateField,
}) => {
  if (!LayoutComponents[layoutItem.type])
    return <>Layout component {layoutItem.type} doesn't exist</>;
  const Component = LayoutComponents[layoutItem.type];
  return (
    <Component
      context={context}
      layoutItem={layoutItem}
      model={model}
      object={object}
      newObject={newObject}
      viewMode={viewMode}
      selectedField={selectedField}
      selectField={selectField}
      updateField={updateField}
    >
      {layoutItem.items?.map((subLayoutItem, subLayoutItemIndex) => (
        <LayoutComponent
          context={context}
          layoutItem={subLayoutItem}
          model={model}
          object={object}
          newObject={newObject}
          viewMode={viewMode}
          selectedField={selectedField}
          selectField={selectField}
          updateField={updateField}
        />
      ))}
    </Component>
  );
};

export default LayoutComponent;
