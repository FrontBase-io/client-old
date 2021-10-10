import { LayoutComponentPropType } from ".";

const Card: React.FC<LayoutComponentPropType> = ({ context, children }) => {
  return <context.UI.Design.Card>{children}</context.UI.Design.Card>;
};

export default Card;
