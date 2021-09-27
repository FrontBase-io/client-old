import Typography from "@material-ui/core/Typography";
import { ModelFieldType } from "../../../../Utils/Types";

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
      modelField.type === "number" ||
      modelField.type === "options" ? (
        <Typography variant="body1">{objectField}</Typography>
      ) : modelField.type === "relationship" ? (
        objectField
      ) : (
        `Unknown type ${modelField.type}`
      )}
    </div>
  );
};

export default FieldDisplay;
