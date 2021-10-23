import React, { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import { ModelType } from "../../../Utils/Types";
import ModelDetail from "./Detail";

const PageModels: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars
  const [models, setModels] = useState<ModelType[]>();

  // Lifecycle
  useEffect(() => {
    context.canvas.navbar.name("Models");

    // Get data
    context.data.models.getAll((response) => {
      setModels(response);
    });
    return () => {
      context.canvas.navbar.name();
    };
  }, [context.canvas.navbar, context.canvas.navbar.name, context.data.models]);

  // UI
  if (!models) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      title="Models"
      items={context.utils.listify(
        models,
        "label_plural",
        "key_plural",
        "icon"
      )}
      baseUrl="/settings/models"
      detailComponent={ModelDetail}
      navWidth={2}
      withoutPadding
      create={{
        onClick: () =>
          context.canvas.interact.dialog({
            display: true,
            title: "Create new model",
            fields: {
              label: { label: "Label", width: 6, linkToKeyField: "key" },
              label_plural: {
                label: "Label (plural)",
                width: 6,
                linkToKeyField: "key_plural",
              },
              key: { label: "Key", width: 6 },
              key_plural: { label: "Key (plural)", width: 6 },
            },
            actions: [
              {
                label: "Create",
                onClick: (form, close) => {
                  //@ts-ignore
                  context.data.models.create(createSampleModel(form)).then(
                    () =>
                      context.canvas.interact.snackbar(
                        "Model created",
                        "success"
                      ),
                    (reason) =>
                      context.canvas.interact.snackbar(reason, "error")
                  );
                  close();
                },
              },
            ],
          }),
      }}
    />
  );
};

export default PageModels;

// Defaults for new model
const createSampleModel: (form: {
  label: string;
  label_plural: string;
  key: string;
  key_plural: string;
}) => void = ({ label, label_plural, key, key_plural }) => {
  return {
    key,
    key_plural,
    label,
    label_plural,
    icon: "exclamation",
    app: "other",
    locked: false,
    permissions: {
      create: ["users"],
      read: ["users"],
      read_own: ["users"],
      list: ["users"],
      update: ["users"],
      update_own: ["users"],
      delete: ["users"],
      delete_own: ["users"],
    },
    fields: {},
    layouts: {
      create: {
        label: "Create",
        layout: [],
      },
      default: {
        label: "Default",
        layout: [
          {
            label: "Animation",
            type: "Animation",
            key: "ktx8vi52",
            items: [
              {
                label: "Card",
                type: "Card",
                key: "ktx8vjri",
              },
            ],
          },
        ],
      },
    },
    lists: {
      default: {
        label: "Default",
        fields: [],
        actions: {
          global: [
            {
              key: "Create",
              label: "Create",
              icon: "plus-square",
              type: "action",
            },
          ],
          single: [
            {
              key: "Delete",
              label: "Delete",
              icon: "trash-alt",
              type: "action",
            },
          ],
          many: [
            {
              key: "Delete",
              label: "Delete",
              icon: "trash-alt",
              type: "action",
            },
          ],
        },
      },
    },
  };
};
