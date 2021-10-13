import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { AppObjectType, ModelType } from "../../../../Utils/Types";
import apps from "../../..";

const ModelHandlers: React.FC<{
  context: AppContext;
  model: ModelType;
  updateModel: (updatedFields: {}) => void;
}> = ({ context, model }) => {
  // Vars

  // Lifecycle
  useEffect(() => {
    context.data.objects.get("apps", {}, (appObjects) => {
      const handlers = [];
      //@ts-ignore
      appObjects.map((appObject: AppObjectType) => {
        const app = apps[appObject.key];
        console.log(app);
      });
    });
  }, [context.data.objects]);

  // UI
  return <>Test</>;
};

export default ModelHandlers;
