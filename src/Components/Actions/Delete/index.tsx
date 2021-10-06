import { Typography } from "@mui/material";
import { ModelType, ObjectType } from "../../../Utils/Types";
import { AppContext } from "../../Context";

const DeleteAction = {
  // Text label
  label: "Delete",
  // Icon
  icon: "trash-alt",
  // Accepts
  // Determines where in the app this button can be shown
  // Can contain one or more of the following:
  // - None -> Can be shown in locations with no context
  // - One -> Can be shown in places with context of a single object (list with a single item selected, object detail view)
  // - Many -> Can be shown in places with context of multiple items (list with multiple selected)
  accepts: ["None", "One", "Many"],

  onClick: (
    context: AppContext,
    objects: ObjectType | ObjectType[] | null,
    model: ModelType
  ) =>
    new Promise<void>((resolve) =>
      context.canvas.interact.dialog({
        display: true,
        title: "Are you sure?",
        text: (
          <>
            {Array.isArray(objects) ? (
              <>
                {model.label_plural}{" "}
                <i>
                  {objects[0][model.primary]} and {objects.length} others
                </i>
              </>
            ) : (
              <>
                {model.label} <i>{objects && objects[model.primary]}</i>
              </>
            )}{" "}
            will be moved to the trash!
          </>
        ),
        size: "sm",
        actions: [
          {
            label: "No, keep",
            onClick: (_, close) => close(),
          },
          {
            label: (
              <Typography style={{ color: "red" }} variant="button">
                Yes, delete
              </Typography>
            ),
            onClick: (_, close) => {
              if (Array.isArray(objects)) {
                console.log("Todo: delete multiple entries at once");
              } else {
                context.data.objects
                  .trash(model.key, objects!._id)
                  .then(() => resolve());
              }

              close();
            },
          },
        ],
      })
    ),
};

export default DeleteAction;
