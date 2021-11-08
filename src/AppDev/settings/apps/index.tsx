import { useEffect, useState } from "react";
import { AppContext } from "../../../Components/Context";
import { ListItemType } from "../../../Utils/Types";
import AppDetail from "./Detail";

const PageApps: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars
  const [appList, setAppList] = useState<ListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    context.data.objects.get("apps", {}, (a) => {
      setAppList(context.utils.listify(a, "name", "key"));
    });
  }, [context.data.objects, context.utils]);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      items={appList}
      detailComponent={AppDetail}
      baseUrl="/settings/apps"
      title="Apps"
      create={{
        label: "Create",
        onClick: () =>
          context.canvas.interact.dialog({
            display: true,
            title: "New app",
            size: "sm",
            content: (close) => (
              <context.UI.Layouts.ObjectDetail
                context={context}
                modelKey="app"
                layoutKey={["create"]}
                withInlineSaveButton
                onSave={() => close()}
              />
            ),
          }),
      }}
    />
  );
};

export default PageApps;
