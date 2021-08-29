import React from "react";
import { AppContext } from "../../../../Components/Context";
import { ModelType } from "../../../../Utils/Types";
import ModelFieldDetail from "./Detail";

const ModelFields: React.FC<{ context: AppContext; model: ModelType }> = ({
  context,
  model,
}) => {
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Layouts.ListDetailLayout
        context={context}
        title="Models"
        items={context.utils.listifyObject(model.fields, "label")}
        baseUrl={`/settings/models/${model.key_plural}/fields`}
        detailComponent={ModelFieldDetail}
        create={{
          onClick: () =>
            context.canvas.interact.dialog({
              display: true,
              title: "Create field",
              size: "sm",
              fields: {
                label: { label: "Field label" },
                key: { label: "Field key", type: "key" },
              },
              actions: [
                {
                  label: "Create",
                  onClick: (form, close) => {
                    context.data.models.update({
                      ...model,
                      fields: {
                        ...model.fields,
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

export default ModelFields;
