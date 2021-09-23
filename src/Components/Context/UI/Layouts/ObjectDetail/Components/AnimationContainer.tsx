import { AppContext } from "../../../..";

const AnimationContainer: React.FC<{ context: AppContext }> = ({
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
