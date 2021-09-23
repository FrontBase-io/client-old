import { AppContext } from "../../../..";
import { LayoutItemType } from "../../../../../../Utils/Types";

const AnimationItem: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
}> = ({ context, children, layoutItem }) => {
  return (
    <context.UI.Design.Animation.Item key={layoutItem.key!}>
      {children}
    </context.UI.Design.Animation.Item>
  );
};

export default AnimationItem;
