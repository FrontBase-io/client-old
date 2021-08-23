import React from "react";
import { AppContext } from "../../../../Components/Context";
import { ModelType } from "../../../../Utils/Types";

const ModelGeneral: React.FC<{ context: AppContext; model: ModelType }> = ({
  context,
}) => {
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title="Fields" withoutMargin style={{ top: 15 }}>
        Test
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default ModelGeneral;
