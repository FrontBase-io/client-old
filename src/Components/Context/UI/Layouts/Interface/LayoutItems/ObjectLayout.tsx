import { AppContext } from "../../../..";
import {
  InterfaceObjectType,
  LayoutItemType,
} from "../../../../../../Utils/Types";

const InterfaceObjectLayout: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
  layout: LayoutItemType[];
  vars: { [key: string]: any };
  baseUrl: string;
  interfaceObject: InterfaceObjectType;
}> = ({ vars, layoutItem, context, baseUrl, interfaceObject }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <context.UI.Layouts.ObjectDetail
      context={context}
      modelKey={layoutItem.args?.model}
      layoutKey={layoutItem.args?.layouts || ["default"]}
      style={{ height: "auto" }}
    />
  );
};

export default InterfaceObjectLayout;
