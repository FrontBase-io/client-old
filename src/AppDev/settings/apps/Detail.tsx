import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import FourOhFour from "../../../Components/FourOhFour";
import { AppObjectType, ListItemType } from "../../../Utils/Types";
import TabGeneral from "./General";

const AppDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}> = ({ context, item }) => {
  // Vars
  const [app, setApp] = useState<AppObjectType>();

  // Lifecycle
  useEffect(() => {
    if (item) setApp(item.object);
  }, [item]);

  // UI
  if (!app) return <context.UI.Loading />;
  return (
    <context.UI.Design.Tabs
      tabs={[
        {
          label: "General",
          component: <TabGeneral context={context} app={app} />,
          key: "general",
        },
        {
          label: "Collection",
          component: <FourOhFour />,
          key: "collection",
          disabled: app.type !== "collection",
        },
      ]}
      urlTrackable
      baseUrl={`/settings/apps/${item.key}`}
      white
    />
  );
};

export default AppDetail;
