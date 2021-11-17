import React from "react";
import { AppContext } from "../../../Components/Context";
import SettingsDetail from "./detail";

const PageSettings: React.FC<{ context: AppContext }> = ({ context }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      baseUrl="/settings/settings"
      title="Settings"
      items={[{ label: "API Keys", key: "api-keys", icon: "table" }]}
      detailComponent={SettingsDetail}
      navWidth={2}
      withoutPadding
    />
  );
};

export default PageSettings;
