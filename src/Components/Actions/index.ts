import { ModelType, ObjectType } from "../../Utils/Types";
import { AppContext } from "../Context";
import CreateAction from "./Create";
import Delete from "./Delete";

// Actions are the buttons that are shown throughout the app with relationship to objects.
// They can be made programatically (such as these) or declaratively from the UI.
// Programatically allows for more custom code to be ran.

interface ActionType {
  accepts: ("None" | "One" | "Many")[];
  label: string;
  icon: string;
  onClick: (
    context: AppContext,
    objects: ObjectType | ObjectType[] | null,
    model: ModelType
  ) => Promise<void>;
}

const Actions: {
  [key: string]: ActionType;
} = {
  Delete: Delete as unknown as ActionType,
  Create: CreateAction as unknown as ActionType,
};

export default Actions;
