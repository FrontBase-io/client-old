import { useEffect, useState } from "react";
import { AppContext } from "../../..";
import { ModelType, ObjectType } from "../../../../../Utils/Types";
import LayoutComponent from "./LayoutComponent";

const ObjectDetail: React.FC<{
  context: AppContext;
  modelKey: string;
  objectId: string;
  baseUrl: string;
  layoutKey?: string;
}> = ({ objectId, modelKey, baseUrl, context, layoutKey }) => {
  // Vars
  const [object, setObject] = useState<ObjectType>();
  const [model, setModel] = useState<ModelType>();

  // Lifecycle
  useEffect(() => {
    context.data.objects.get(modelKey, { _id: objectId }, (objects) => {
      setObject(objects[0]);
      context.data.models.get(objects[0].meta.model, (model) => {
        setModel(model);
        context.canvas.name.set(objects[0][model.primary]);
        context.canvas.up.set(baseUrl);
      });
    });

    return () => {
      context.canvas.name.set(undefined);
      context.canvas.up.set(undefined);
    };
  }, [objectId, modelKey]);

  // UI
  if (!model || !object) return <context.UI.Loading />;
  if (!(model.layouts || {})[layoutKey || "default"])
    return (
      <context.UI.Design.Animation.Animate>
        Layout {layoutKey || "default"} not found.
      </context.UI.Design.Animation.Animate>
    );
  const layout = model.layouts[layoutKey || "default"].layout;

  return (
    <>
      {layout.map((layoutItem, layoutItemIndex) => (
        <LayoutComponent
          layoutItem={layoutItem}
          context={context}
          key={`layoutItem-${layoutItemIndex}`}
          model={model}
          object={object}
        />
      ))}
    </>
  );
};

export default ObjectDetail;
