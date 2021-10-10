import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { LayoutComponentPropType } from ".";
import { ModelType, ObjectType } from "../../../../../../Utils/Types";

const RelatedItem: React.FC<LayoutComponentPropType> = ({
  context,
  layoutItem,
  model,
  object,
}) => {
  // Vars
  const [targetObject, setTargetObject] = useState<ObjectType>();
  const [targetModel, setTargetModel] = useState<ModelType>();
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    context.data.models.get(
      model.fields[layoutItem.args?.field].relationshipTo!,
      (fetchedModel) => {
        setTargetModel(fetchedModel);
        context.data.objects.get(
          model.fields[layoutItem.args?.field].relationshipTo!,
          { _id: object![layoutItem.args?.field] },
          (fetchedObjects) => setTargetObject(fetchedObjects[0])
        );
      }
    );
  }, [context.data.models, context.data.objects, layoutItem, model, object]);

  // UI
  if (!targetObject || !targetModel) return <context.UI.Loading />;
  return (
    <>
      <div style={{ float: "right" }}>
        <Button onClick={() => history.push(`/o/${targetObject._id}`)}>
          View
        </Button>
      </div>
      <Typography variant="h6">
        {model.fields[layoutItem.args?.field].label}
      </Typography>
      {layoutItem.args?.fields.map((field: string) => (
        <context.UI.Data.FieldDisplay
          context={context}
          object={targetObject}
          model={targetModel}
          fieldKey={field}
          key={`field-${field}`}
        />
      ))}
    </>
  );
};

export default RelatedItem;
