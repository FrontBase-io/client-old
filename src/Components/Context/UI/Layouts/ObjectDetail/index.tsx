import { useEffect, useState } from "react";
import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";

const ObjectDetail: React.FC<{
  context: AppContext;
  modelKey: string;
  objectId: string;
  baseUrl: string;
}> = ({
  objectId,
  modelKey,
  baseUrl,
  context: {
    data,
    canvas,
    UI: {
      Loading,
      Design: {
        Animation: { Animate },
        Card,
        Icon,
      },
    },
  },
}) => {
  // Vars
  const [object, setObject] = useState<ObjectType>();
  const [model, setModel] = useState<ModelType>();

  // Lifecycle
  useEffect(() => {
    data.objects.get(modelKey, { _id: objectId }, (objects) => {
      setObject(objects[0]);
      data.models.get(objects[0].meta.model, (model) => {
        setModel(model);
        canvas.name.set(objects[0][model.primary]);
        canvas.up.set(baseUrl);
      });
    });

    return () => {
      canvas.name.set(undefined);
      canvas.up.set(undefined);
    };
  }, [objectId]);

  // UI
  if (!model || !object) return <Loading />;
  return <Animate>{object[model.primary]}</Animate>;
};

export default ObjectDetail;
