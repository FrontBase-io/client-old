import { Button, Grid } from "@mui/material";
import React, { useState } from "react";
import { AppContext } from "../../../../Components/Context";
import Icon from "../../../../Components/Design/Icon";
import { ModelType } from "../../../../Utils/Types";
import ModelListDetail from "./Detail";

const ModelLists: React.FC<{
  context: AppContext;
  model: ModelType;
  updateModel: (updatedFields: {}) => void;
}> = ({ context, model, updateModel }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Layouts.ListDetailLayout
        context={context}
        title="Lists"
        items={context.utils.listifyObject(model.lists, "label")}
        baseUrl={`/settings/models/${model.key_plural}/lists`}
        navWidth={2}
        //@ts-ignore
        detailComponent={ModelListDetail}
        detailComponentProps={{ model }}
        create={{
          onClick: () =>
            context.canvas.interact.dialog({
              display: true,
              title: "Create list",
              size: "sm",
              fields: {
                label: { label: "List label", linkToKeyField: "key" },
                key: { label: "List key", type: "key" },
              },
              actions: [
                {
                  label: "Create",
                  onClick: (form, close) => {
                    context.data.models.update({
                      ...model,
                      lists: {
                        ...model.lists,
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

export default ModelLists;
