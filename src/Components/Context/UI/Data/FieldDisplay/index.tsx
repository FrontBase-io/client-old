import Typography from "@mui/material/Typography";
import { ModelFieldType, SelectOptionType } from "../../../../../Utils/Types";
import find from "lodash/find";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

const FieldDisplay: React.FC<{
  fieldKey: string;
  modelField: ModelFieldType;
  objectField: any;
  onDoubleClick?: (fieldName: string) => void;
  withoutLabel?: true;
}> = ({ modelField, objectField, onDoubleClick, fieldKey, withoutLabel }) => {
  // Vars
  // Lifecycle
  // UI

  return (
    <div onDoubleClick={() => onDoubleClick && onDoubleClick(fieldKey)}>
      {!withoutLabel && (
        <Typography
          variant="caption"
          style={{ fontSize: 16, display: "block", fontWeight: "bold" }}
        >
          {modelField.label}
        </Typography>
      )}
      {modelField.type === "text" ||
      modelField.type === "formula" ||
      modelField.type === "number" ? (
        <Typography variant="body1">{objectField}</Typography>
      ) : modelField.type === "relationship" ? (
        objectField
      ) : modelField.type === "date" ? (
        objectField &&
        format(
          typeof objectField === "string" ? parseISO(objectField) : objectField,
          "dd/MM/yyyy"
        )
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
