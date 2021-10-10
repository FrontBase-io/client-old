import { LayoutComponentPropType } from ".";
import FieldDisplay from "../../../Data/FieldDisplay";
import FieldEdit from "../../../Data/FieldEdit";

const Field: React.FC<LayoutComponentPropType> = ({
  context,
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
