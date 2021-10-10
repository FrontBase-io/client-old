import { LayoutComponentPropType } from ".";

const AnimationItem: React.FC<LayoutComponentPropType> = ({
  context,
  children,
  layoutItem,
}) => {
  return (
    <context.UI.Design.Animation.Item key={layoutItem.key!}>
      {children}
    </context.UI.Design.Animation.Item>
  );
};

export default AnimationItem;
