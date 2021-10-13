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
      items={[
        { label: "Link handlers", key: "link-handlers", icon: "hands-helping" },
      ]}
      detailComponent={SettingsDetail}
      navWidth={2}
      withoutPadding
    />
  );
};

export default PageSettings;
