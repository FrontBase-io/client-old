import React from "react";
import { AppContext } from "../../../Components/Context";
import { ListItemType } from "../../../Utils/Types";
import ModelFields from "./Fields";
import ModelGeneral from "./General";

const ModelDetail: React.FC<{
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}> = ({ context, selectedKey, item }) => {
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card withoutPadding>
        <context.UI.Design.Tabs
          tabs={[
            { label: "General", key: "general", component: ModelGeneral },
            { label: "Fields", key: "fields", component: ModelFields },
          ]}
          urlTrackable
          baseUrl={`/settings/models/${item.key}`}
        />
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default ModelDetail;
