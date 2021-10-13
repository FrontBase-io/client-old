import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { AppObjectType, ModelType } from "../../../../Utils/Types";
import apps from "../../..";
import { map } from "lodash";

const ModelHandlers: React.FC<{
  context: AppContext;
  model: ModelType;
  updateModel: (updatedFields: {}) => void;
}> = ({ context, model, updateModel }) => {
  // Vars
  const [handlers, setHandlers] = useState<{
    [handlerKey: string]: { url: string; label: string };
  }>();

  // Lifecycle
  useEffect(() => {
    context.data.objects.get("apps", {}, (appObjects) => {
      const newHandlers: {
        [handlerKey: string]: { url: string; label: string };
      } = {};
      //@ts-ignore
      appObjects.map((appObject: AppObjectType) => {
        const app = apps[appObject.key];
        if (app) {
          if (app.handlers) {
            map(app.handlers, (handler, handlerKey) => {
              if (
                handler.accepts === "*" ||
                handler.accepts.includes(model.key)
              ) {
                newHandlers[`${appObject.key}-${handlerKey}`] = {
                  url: handler.url,
                  label: `${appObject.name}: ${handler.label}`,
                };
              }
            });
            setHandlers(newHandlers);
          }
        }
      });
    });
  }, [context.data.objects, model.key]);

  // UI
  if (!handlers) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title="Handlers">
        <context.UI.Inputs.Options
          label="Pick a handler"
          options={context.utils.listifyObjectForSelect(handlers, "label")}
          value={model.handler || "explorer-object-detail"}
          onChange={(handler) => {
            console.log(handler);

            updateModel({ handler: handler });
          }}
        />
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default ModelHandlers;
