import { AppContext } from "../../..";
import { LayoutItemType } from "../../../../../Utils/Types";
import LayoutComponents from "./Components";

const LayoutComponent: React.FC<{
  layoutItem: LayoutItemType;
  context: AppContext;
}> = ({ layoutItem, context }) => {
  if (!LayoutComponents[layoutItem.type])
    return <>Layout component {layoutItem.type} doesn't exist</>;
  const Component = LayoutComponents[layoutItem.type];
  return (
    <Component context={context} layoutItem={layoutItem}>
      {layoutItem.items?.map((subLayoutItem, subLayoutItemIndex) => (
        <LayoutComponent context={context} layoutItem={subLayoutItem} />
      ))}
    </Component>
  );
};

export default LayoutComponent;
