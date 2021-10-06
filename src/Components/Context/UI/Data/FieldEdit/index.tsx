import { Typography } from "@mui/material";
import { useGlobal } from "reactn";
import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";

const FieldEdit: React.FC<{
  selectedField?: string;
  fieldKey: string;
  model: ModelType;
  object?: ObjectType;
  context: AppContext;
  onChange: (newValue: string | Date) => void;
  hasChanged?: boolean;
}> = ({
  selectedField,
  model,
  object,
  fieldKey,
  context,
  onChange,
  hasChanged,
}) => {
  // Vars
  const [theme] = useGlobal<any>("theme");
  const modelField = model.fields[fieldKey];
  const objectField = object && object[fieldKey];

  // UI
  return (
    <div
      style={
        hasChanged
          ? {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgb(80,80,80)"
                  : "rgb(240,240,240)",
              padding: 8,
              borderRadius: 6,
              transition: "all 0.3s",
              margin: "10px 0",
            }
          : { transition: "all 0.3s" }
      }
    >
      {modelField.type === "text" ? (
        <context.UI.Inputs.Text
          label={modelField.label}
          value={objectField}
          autoFocus={selectedField === fieldKey}
          onChange={onChange}
        />
      ) : modelField.type === "options" ? (
        <context.UI.Inputs.Select
          label={modelField.label}
          value={objectField}
          autoFocus={selectedField === fieldKey}
          onChange={(value) => onChange(value as string)}
          options={modelField.options || []}
        />
      ) : modelField.type === "date" ? (
        <context.UI.Inputs.Date
          label={modelField.label}
          value={objectField}
          autoFocus={selectedField === fieldKey}
          onChange={onChange}
        />
      ) : modelField.type === "relationship" ? (
        <context.UI.Inputs.Relationship
          label={modelField.label}
          context={context}
          modelKey={modelField.relationshipTo!}
          object={object}
          value={objectField}
          autoFocus={selectedField === fieldKey}
          onChange={(value) => onChange(value as string)}
        />
      ) : modelField.type === "formula" ? (
        <>
          <Typography
            variant="caption"
            style={{ fontSize: 16, display: "block", fontWeight: "bold" }}
          >
            {modelField.label}
          </Typography>
          {objectField}
        </>
      ) : (
        `Unknown type ${modelField.type}`
      )}
    </div>
  );
};

export default FieldEdit;