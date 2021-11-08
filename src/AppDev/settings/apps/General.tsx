import { AppContext } from "../../../Components/Context";
import { AppObjectType } from "../../../Utils/Types";

const TabGeneral: React.FC<{ context: AppContext; app: AppObjectType }> = ({
  context,
  app,
}) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <context.UI.Layouts.ObjectDetail
      context={context}
      modelKey="app"
      layoutKey={["default"]}
      object={app}
    />
  );
};

export default TabGeneral;
