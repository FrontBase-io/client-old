import { AppContext } from "../../../..";
import {
  LayoutItemType,
  ModelType,
  ObjectType,
} from "../../../../../../Utils/Types";
import FieldDisplay from "../../../../Data/FieldDisplay";

const Field: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  model: ModelType;
  object: ObjectType;
}> = ({ context, children, layoutItem, model, object }) => {
  // Vars
  const modelField = model.fields[layoutItem.args?.field];
  const objectField = object[layoutItem.args?.field];
  // Lifecycle
  // UI
  return <FieldDisplay modelField={modelField} objectField={objectField} />;
};

export default Field;
