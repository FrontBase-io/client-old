import Typography from "@mui/material/Typography";
import {
  ModelType,
  ObjectType,
  SelectOptionType,
} from "../../../../../Utils/Types";
import find from "lodash/find";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import DisplayRelationship from "./Relationship";
import { AppContext } from "../../..";

const FieldDisplay: React.FC<{
  context: AppContext;
  fieldKey: string;
  model: ModelType;
  object: ObjectType;
  onDoubleClick?: (fieldName: string) => void;
  withoutLabel?: true;
}> = ({ model, object, onDoubleClick, fieldKey, withoutLabel, context }) => {
  // Vars
  const modelField = model.fields[fieldKey];
  const objectField = object[fieldKey];

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
        <DisplayRelationship
          context={context}
          model={model}
          object={object}
          fieldKey={fieldKey}
        />
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
