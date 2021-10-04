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

  onClick(context: AppContext) {
    context.canvas.interact.dialog({
      display: true,
      title: "Are you sure?",
      text: "This item will be moved to the trash.",
    });
  },
};

export default DeleteAction;
