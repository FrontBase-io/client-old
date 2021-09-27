import Typography from "@material-ui/core/Typography";
import { ModelFieldType, SelectOptionType } from "../../../../Utils/Types";
import find from "lodash/find";

const FieldDisplay: React.FC<{
  fieldKey: string;
  modelField: ModelFieldType;
  objectField: any;
  onDoubleClick?: (fieldName: string) => void;
}> = ({ modelField, objectField, onDoubleClick, fieldKey }) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <div onDoubleClick={() => onDoubleClick && onDoubleClick(fieldKey)}>
      <Typography
        variant="caption"
        style={{ fontSize: 16, display: "block", fontWeight: "bold" }}
      >
        {modelField.label}
      </Typography>
      {modelField.type === "text" ||
      modelField.type === "formula" ||
      modelField.type === "number" ? (
        <Typography variant="body1">{objectField}</Typography>
      ) : modelField.type === "relationship" ? (
        objectField
      ) : modelField.type === "options" ? (
        find(
          modelField.options!,
          (o: SelectOptionType) => o.value === objectField
        )?.label
      ) : (
        `Unknown type ${modelField.type}`
      )}
    </div>
  );
};

export default FieldDisplay;
