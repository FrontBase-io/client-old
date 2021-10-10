import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";

const DisplayRelationshipM: React.FC<{
  model: ModelType;
  object?: ObjectType;
  fieldKey: string;
  context: AppContext;
}> = ({ model, object, fieldKey, context }) => {
  // Vars
  const [targetObjects, setTargetObjects] = useState<ObjectType[]>();
  const [targetModel, setTargetModel] = useState<ModelType>();
  // Lifecycle
  useEffect(() => {
    if (object) {
      context.data.objects.get(
        model.fields[fieldKey].relationshipTo!,
        { _id: { $in: object[fieldKey] } },
        (objects) => {
          context.data.models.get(
            model.fields[fieldKey].relationshipTo!,
            (retrievedModel) => {
              setTargetModel(retrievedModel);
              setTargetObjects(objects);
            }
          );
        }
      );
    }
  }, [
    context.data.models,
    context.data.objects,
    fieldKey,
    model.fields,
    object,
  ]);
  // UI
  if (!targetObjects || !targetModel) return <context.UI.Loading />;
  return (
    <>
      {targetObjects.map((obj, objIndex) => (
        <Fragment key={objIndex}>
          <Link to={`/o/${obj._id}`} key={obj._id}>
            {obj[targetModel.primary]}
          </Link>
          {targetObjects.length - 1 > objIndex && ", "}{" "}
        </Fragment>
      ))}
    </>
  );
};

export default DisplayRelationshipM;
