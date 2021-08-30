import React from "react";
import { AppContext } from "../../../../Components/Context";
import { ModelType } from "../../../../Utils/Types";
import ModelLayoutDetail from "./Detail";

const ModelLayouts: React.FC<{ context: AppContext; model: ModelType }> = ({
  context,
  model,
}) => {
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Layouts.ListDetailLayout
        context={context}
        title="Layouts"
        items={context.utils.listifyObject(model.layouts, "label")}
        baseUrl={`/settings/models/${model.key_plural}/layouts`}
        navWidth={2}
        //@ts-ignore
        detailComponent={ModelLayoutDetail}
        detailComponentProps={{ model }}
        create={{
          onClick: () =>
            context.canvas.interact.dialog({
              display: true,
              title: "Create Layout",
              size: "sm",
              fields: {
                label: { label: "Layout label" },
                key: { label: "Layout key", type: "key" },
              },
              actions: [
                {
                  label: "Create",
                  onClick: (form, close) => {
                    context.data.models.update({
                      ...model,
                      layouts: {
                        ...model.layouts,
                        [form.key]: { label: form.label },
                      },
                    });
                    close();
                  },
                },
              ],
            }),
        }}
      />
    </context.UI.Design.Animation.Animate>
  );
};

export default ModelLayouts;
