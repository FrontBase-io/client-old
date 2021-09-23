import Typography from "@material-ui/core/Typography";
import { ModelFieldType } from "../../../../Utils/Types";

const FieldDisplay: React.FC<{ modelField: ModelFieldType; objectField: any }> =
  ({ modelField, objectField }) => {
    // Vars
    // Lifecycle
    // UI
    return (
      <>
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
      </>
    );
  };

export default FieldDisplay;
