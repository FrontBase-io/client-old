import { ModelType, ObjectType } from "../../Utils/Types";
import { AppContext } from "../Context";
import Delete from "./Delete";

// Actions are the buttons that are shown throughout the app with relationship to objects.
// They can be made programatically (such as these) or declaratively from the UI.
// Programatically allows for more custom code to be ran.

interface ActionType {
  accepts: ("None" | "One" | "Many")[];
  label: string;
  onClick: (
    context: AppContext,
    objects: ObjectType | ObjectType[],
    model: ModelType
  ) => void;
}

const Actions: {
  [key: string]: ActionType;
} = { Delete: Delete as unknown as ActionType };

export default Actions;
