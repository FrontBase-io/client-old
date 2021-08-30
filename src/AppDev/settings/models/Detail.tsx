import React from "react";
import { AppContext } from "../../../Components/Context";
import { ListItemType } from "../../../Utils/Types";
import ModelFields from "./Fields";
import ModelGeneral from "./General";
import ModelLayouts from "./Layouts";

const ModelDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}> = ({ context, selectedKey, item }) => {
  // Vars
  const updateModel = (newModel: {}) => {
    context.data.models.update(newModel).then(
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
        ]}
        urlTrackable
        baseUrl={`/settings/models/${item.key}`}
        white
      />
    </context.UI.Design.Animation.Animate>
  );
};

export default ModelDetail;
