import { AppContextType } from "@frontbase/types";
import { useEffect } from "react";
import { AppPageType } from "../../../Utils/Types";
import { APIAppType } from "../Types";

const AppHubDetail: React.FC<{
  context: AppContextType;
  remoteApp: APIAppType;
}> = ({ context, remoteApp }) => {
  // Vars
  // Lifecycle
  useEffect(() => {
    context.canvas.navbar.name(remoteApp.name);
    context.canvas.navbar.up("/app-hub/hub");
    return () => {
      context.canvas.navbar.name();
      context.canvas.navbar.up(undefined);
    };
  }, [remoteApp]);

  // UI
  return (
    <context.UI.Design.Animation.Animate>
      <context.UI.Design.Card title={remoteApp.name}>
        {remoteApp.description}
      </context.UI.Design.Card>
    </context.UI.Design.Animation.Animate>
  );
};

export default AppHubDetail;
