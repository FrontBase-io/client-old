import { AppContext } from "../../Components/Context";
import { AppObjectType, AppPageType } from "../../Utils/Types";

const Interface: React.FC<{
  context: AppContext;
  page: AppPageType;
  selectedPageKey: string;
  interfaceKey: string;
  app: AppObjectType;
}> = ({ context, interfaceKey, page, app }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <context.UI.Layouts.Interface
      context={context}
      interfaceObjectKey={interfaceKey}
      baseUrl={`/${app.key}/${page.key}`}
    />
  );
};

export default Interface;
