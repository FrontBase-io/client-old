import React from "react";
import { AppContext } from "../../../Components/Context";
import { ListItemType } from "../../../Utils/Types";
import ModelFields from "./Fields";
import ModelGeneral from "./General";
import ModelHandlers from "./Handlers";
import ModelLayouts from "./Layouts";
import ModelLists from "./Lists";
import ModelPermissions from "./Permissions";

const ModelDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}> = ({ context, selectedKey, item }) => {
  // Vars
  const updateModel = (newModel: {}) => {
    context.data.models.update({ ...newModel, key: item.object.key }).then(
      () => {},
      (reason: string) => context.canvas.interact.snackbar(reason, "error")
    );
  };
  // Lifecycle

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Tabs
        tabs={[
          {
            label: "General",
            key: "general",
            component: (
              <ModelGeneral
                context={context}
                model={item.object}
                updateModel={updateModel}
              />
            ),
          },
          {
            label: "Fields",
            key: "fields",
            component: <ModelFields context={context} model={item.object} />,
          },
          {
            label: "Layouts",
            key: "layouts",
            component: <ModelLayouts context={context} model={item.object} />,
          },
          {
            label: "Lists",
            key: "lists",
            component: (
              <ModelLists
                context={context}
                model={item.object}
                updateModel={updateModel}
              />
            ),
          },
          {
            label: "Handlers",
            key: "handlers",
            component: (
              <ModelHandlers
                context={context}
                model={item.object}
                updateModel={updateModel}
              />
            ),
          },
          {
            label: "Permissions",
            key: "permissions",
            component: (
              <ModelPermissions
                context={context}
                model={item.object}
                updateModel={updateModel}
              />
            ),
          },
        ]}
        urlTrackable
        baseUrl={`/settings/models/${item.key}`}
        white
      />
    </context.UI.Design.Animation.Animate>
  );
};

export default ModelDetail;
