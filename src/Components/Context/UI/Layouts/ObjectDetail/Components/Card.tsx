import { AppContext } from "../../../..";

const Card: React.FC<{ context: AppContext }> = ({ context, children }) => {
  return <context.UI.Design.Card>{children}</context.UI.Design.Card>;
};

export default Card;
