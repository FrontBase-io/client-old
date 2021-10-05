import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";

const DisplayRelationship: React.FC<{
  model: ModelType;
  object: ObjectType;
  fieldKey: string;
  context: AppContext;
}> = ({ model, object, fieldKey, context }) => {
  // Vars
  const [targetObject, setTargetObject] = useState<ObjectType>();
  const [targetModel, setTargetModel] = useState<ModelType>();
  // Lifecycle
  useEffect(() => {
    context.data.objects.get(
      model.fields[fieldKey].relationshipTo!,
      { _id: object[fieldKey] },
      (objects) => {
        context.data.models.get(
          model.fields[fieldKey].relationshipTo!,
          (retrievedModel) => {
            setTargetModel(retrievedModel);
            setTargetObject(objects[0]);
          }
        );
      }
    );
  }, [
    context.data.models,
    context.data.objects,
    fieldKey,
    model.fields,
    object,
  ]);
  // UI
  if (!targetObject || !targetModel) return <context.UI.Loading />;
  return (
    <Link to={`/o/${targetObject._id}`}>
      <Typography color="primary">
        {targetObject[targetModel.primary]}
      </Typography>
    </Link>
  );
};

export default DisplayRelationship;
