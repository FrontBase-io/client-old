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
import DisplayRelationshipM from "./Relationship_m";
import DisplayColor from "./Color";
import DisplayImage from "./Image";
import { serverUrl } from "../../../../../Utils/Socket";
import Icon from "../../../../Design/Icon";
//@ts-ignore
import JSONInput from "react-json-editor-ajrm";
import { useGlobal } from "reactn";

const FieldDisplay: React.FC<{
  context: AppContext;
  fieldKey: string;
  model: ModelType;
  object?: ObjectType;
  onDoubleClick?: (fieldName: string) => void;
  withoutLabel?: true;
}> = ({ model, object, onDoubleClick, fieldKey, withoutLabel, context }) => {
  // Vars
  const modelField = model.fields[fieldKey];
  const objectField = object && object[fieldKey];
  const [theme] = useGlobal<any>("theme");

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
        modelField.displayType === "url" ? (
          <a href={objectField} target="_blank" rel="noopener noreferrer">
            <Icon
              icon="external-link-alt"
              size={10}
              style={{ color: "white", marginRight: 5 }}
            />
            {objectField}
          </a>
        ) : (
          <Typography variant="body1">{objectField}</Typography>
        )
      ) : modelField.type === "relationship" ? (
        <DisplayRelationship
          context={context}
          model={model}
          object={object}
          fieldKey={fieldKey}
        />
      ) : modelField.type === "relationship_m" ? (
        <DisplayRelationshipM
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
          //@ts-ignore
        )?.label || "error"
      ) : modelField.type === "color" ? (
        <DisplayColor
          context={context}
          model={model}
          object={object}
          fieldKey={fieldKey}
        />
      ) : modelField.type === "image" ? (
        <DisplayImage
          src={`${serverUrl}${objectField}`}
          alt={modelField.label}
        />
      ) : modelField.type === "boolean" ? (
        <context.UI.Inputs.Boolean
          label={modelField.label}
          disabled
          value={objectField}
        />
      ) : modelField.type === "free-data" ? (
        <JSONInput
          height={200}
          label={modelField.label}
          placeholder={objectField}
          viewOnly
          theme={
            theme.palette.mode === "light"
              ? "light_mitsuketa_tribute"
              : "dark_vscode_tribute"
          }
        />
      ) : (
        `Unknown type ${modelField.type}`
      )}
    </div>
  );
};

export default FieldDisplay;
