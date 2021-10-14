import { AppContext } from "../../../../Components/Context";
import { ListItemType } from "../../../../Utils/Types";

const SettingsLinkHandler: React.FC<{
  context: AppContext;
  item: ListItemType;
}> = ({ context, item }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title={item.label}>
        Link handlers have moved elsewhere.
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default SettingsLinkHandler;
