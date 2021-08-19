import React from "react";
import { AppContext } from "../../../Components/Context";

const ModelDetail: React.FC<{ context: AppContext; selectedKey: string }> = ({
  context,
  selectedKey,
}) => {
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title={selectedKey}>
        Some data
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default ModelDetail;
