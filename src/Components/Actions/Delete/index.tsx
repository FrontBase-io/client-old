import { Typography } from "@mui/material";
import { map, reject } from "lodash";
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
                {model.label_plural} <i>{objects[0][model.primary]}</i> and{" "}
                <i>
                  {objects.length - 1} other
                  {objects.length - 1 !== 1 && "s"}
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
                context.data.objects
                  .trashMany(
                    model.key,
                    map(objects!, (o) => o._id)
                  )
                  .then(
                    () => resolve(),
                    (errors) => {
                      context.canvas.interact.snackbar(
                        errors.join(", "),
                        "error"
                      );
                      reject(errors);
                    }
                  );
              } else {
                context.data.objects.trash(model.key, objects!._id).then(
                  () => {
                    context.canvas.interact.snackbar(
                      `${(objects || []).length} objects deleted`,
                      "success"
                    );
                    resolve();
                  },
                  (reason) => {
                    context.canvas.interact.snackbar(reason, "error");
                    reject(reason);
                  }
                );
              }

              close();
            },
          },
        ],
      })
    ),
};

export default DeleteAction;
