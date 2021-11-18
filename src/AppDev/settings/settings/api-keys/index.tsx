import { useEffect, useState } from "react";
import { AppContext } from "../../../../Components/Context";
import { ListItemType } from "../../../../Utils/Types";
import SettingsApiKeyDetail from "./detail";
import Server from "../../../../Utils/Socket";

interface ApiKeyType {
  label: string;
}

const SettingsApiKeys: React.FC<{
  context: AppContext;
  item: ListItemType;
}> = ({ context, item }) => {
  // Vars
  const [apiKeys, setApiKeys] = useState<ListItemType[]>();

  // Lifecycle
  useEffect(() => {
    context.data.settings.system.get("api-keys", (response) => {
      if (response.reason === "no-such-setting") {
        setApiKeys([]);
      } else {
        setApiKeys(context.utils.listifyObject(response.value, "label"));
      }
    });
  }, []);

  // UI
  if (!apiKeys) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      title="API Keys"
      context={context}
      baseUrl="/settings/settings/api-keys"
      items={apiKeys}
      create={{
        label: "Create API key",
        onClick: () =>
          context.canvas.interact.dialog({
            display: true,
            title: "New API key",
            text: "Every key comes with a permission. Once you assign this permission to models everyone with this key can perform the allowed actions. ",
            fields: {
              label: { label: "Label", width: 8, linkToKeyField: "key" },
              key: { label: "Key", width: 4, type: "key" },
            },
            size: "sm",
            actions: [
              {
                label: "Create key",
                onClick: (form, close) =>
                  Server.emit("createApiKey", form.label, form.key, () =>
                    window.location.reload()
                  ),
              },
            ],
          }),
      }}
      detailComponent={SettingsApiKeyDetail}
    />
  );
};

export default SettingsApiKeys;
