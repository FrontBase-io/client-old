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
        items={context.utils.listifyObject(
          model.fields,
          "label",
          "type",
          "type"
        )}
        transformIcon={(icon: string) => {
          const map: { [key: string]: string } = {
            text: "font",
            number: "sort-numeric-down",
            relationship: "link",
            relationship_m: "network-wired",
            formula: "flask",
            options: "list",
            date: "calendar-alt",
          };
          return map[icon];
        }}
        baseUrl={`/settings/models/${model.key_plural}/fields`}
        navWidth={3}
        //@ts-ignore
        detailComponent={ModelFieldDetail}
        detailComponentProps={{ model }}
        withoutPadding
        create={{
          onClick: () =>
            context.canvas.interact.dialog({
              display: true,
              title: "Create field",
              size: "sm",
              fields: {
                label: { label: "Field label", linkToKeyField: "key" },
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
                        [form.key]: { label: form.label, type: "text" },
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
