import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { ListItemType } from "../../../../Utils/Types";

const SettingsLinkHandler: React.FC<{
  context: AppContext;
  item: ListItemType;
}> = ({ context, item }) => {
  // Vars
  const [linkHandlers, setLinkHandlers] = useState<{}>();

  // Lifecycle
  useEffect(() => {
    context.data.settings.system.get("link-handlers", (response) => {
      if (response.success) {
        setLinkHandlers(response.value);
      } else {
        setLinkHandlers({});
      }
    });
  }, [context.data.settings.system, item]);

  // UI
  if (!linkHandlers) return <context.UI.Loading />;
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title={item.label}>
        Testing link handlers
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default SettingsLinkHandler;
