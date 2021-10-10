import { LayoutComponentPropType } from ".";

const Animation: React.FC<LayoutComponentPropType> = ({
  context,
  children,
  layoutItem,
}) => {
  return (
    <context.UI.Design.Animation.Animate>
      {children}
    </context.UI.Design.Animation.Animate>
  );
};

export default Animation;
