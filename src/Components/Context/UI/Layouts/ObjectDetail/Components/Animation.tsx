import { AppContext } from "../../../..";
import { LayoutItemType } from "../../../../../../Utils/Types";

const Animation: React.FC<{
  context: AppContext;
  layoutItem: LayoutItemType;
}> = ({ context, children, layoutItem }) => {
  return (
    <context.UI.Design.Animation.Animate>
      {children}
    </context.UI.Design.Animation.Animate>
  );
};

export default Animation;
