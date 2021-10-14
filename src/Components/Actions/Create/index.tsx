import { ModelType, ObjectType } from "../../../Utils/Types";
import { AppContext } from "../../Context";

const CreateAction = {
  // Text label
  label: "Create",
  // Icon
  icon: "plus-square",
  // Accepts
  // Determines where in the app this button can be shown
  // Can contain one or more of the following:
  // - None -> Can be shown in locations with no context
  // - One -> Can be shown in places with context of a single object (list with a single item selected, object detail view)
  // - Many -> Can be shown in places with context of multiple items (list with multiple selected)
  accepts: ["None"],

  onClick: (
    context: AppContext,
    objects: ObjectType | ObjectType[] | null,
    model: ModelType
  ) =>
    new Promise((resolve, reject) =>
      context.canvas.interact.dialog({
        display: true,
        title: `Create new ${model.label}`,
        fields: {
          object: {
            label: "test",
            type: "custom",
            component: context.UI.Layouts.ObjectDetail,
            componentProps: {
              context,
              model,
              modelKey: model.key,
              layoutKey: ["create", "default"],
            },
          },
        },
        actions: [
          {
            label: `Create ${model.label}`,
            onClick: (form, close) => {
              context.data.objects.create(model.key, form.object).then(
                () => {},
                (reason) => context.canvas.interact.snackbar(reason, "error")
              );
              close();
            },
          },
        ],
        size: "md",
      })
    ),
};

export default CreateAction;
