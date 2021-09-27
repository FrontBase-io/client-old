import { useGlobal } from "reactn";
import { AppContext } from "../..";
import { ModelFieldType } from "../../../../Utils/Types";

const FieldEdit: React.FC<{
  selectedField?: string;
  fieldKey: string;
  modelField: ModelFieldType;
  objectField: any;
  context: AppContext;
  onChange: (newValue: string) => void;
  hasChanged?: boolean;
}> = ({
  selectedField,
  modelField,
  objectField,
  fieldKey,
  context,
  onChange,
  hasChanged,
}) => {
  // Vars
  const [theme] = useGlobal<any>("theme");

  // UI
  return (
    <div
      style={
        hasChanged
          ? {
              backgroundColor:
                theme.palette.type === "dark"
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
      ) : (
        `Unknown type ${modelField.type}`
      )}
    </div>
  );
};

export default FieldEdit;
