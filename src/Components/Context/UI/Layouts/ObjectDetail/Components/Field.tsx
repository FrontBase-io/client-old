import { AppContext } from "../../../..";
import {
  LayoutItemType,
  ModelType,
  ObjectType,
} from "../../../../../../Utils/Types";
import FieldDisplay from "../../../Data/FieldDisplay";
import FieldEdit from "../../../Data/FieldEdit";

const Field: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  model: ModelType;
  object?: ObjectType;
  newObject?: ObjectType;
  viewMode: "view" | "edit";
  selectedField?: string;
  selectField: (fieldName: string) => void;
  updateField: (key: string, newValue: any) => void;
}> = ({
  context,
  children,
  layoutItem,
  model,
  object,
  newObject,
  viewMode,
  selectedField,
  selectField,
  updateField,
}) => {
  // Vars
  const objectField = newObject ? newObject[layoutItem.args?.field] : "";

  // Lifecycle
  // UI
  return viewMode === "view" ? (
    <FieldDisplay
      context={context}
      model={model}
      object={object}
      fieldKey={layoutItem.args?.field}
      onDoubleClick={(fieldName) => selectField(fieldName)}
    />
  ) : (
    <FieldEdit
      selectedField={selectedField}
      model={model}
      object={object}
      fieldKey={layoutItem.args?.field}
      context={context}
      onChange={(newValue) => updateField(layoutItem.args?.field, newValue)}
      hasChanged={
        objectField !== (object ? object[layoutItem.args?.field] : null)
      }
    />
  );
};

export default Field;
