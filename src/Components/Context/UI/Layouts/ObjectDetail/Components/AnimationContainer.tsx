import { LayoutComponentPropType } from ".";

const AnimationContainer: React.FC<LayoutComponentPropType> = ({
  context,
  children,
}) => {
  return (
    <context.UI.Design.Animation.Container>
      {children}
    </context.UI.Design.Animation.Container>
  );
};

export default AnimationContainer;
