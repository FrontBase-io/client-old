import { useHistory } from "react-router";
import { AppContext } from "../../Components/Context";
import { ModelType } from "../../Utils/Types";

const ObjectDetail: React.FC<{ context: AppContext; model: ModelType }> = ({
  context,
  model,
}) => {
  // Vars
  const objectId = window.location.href.split("/")[5];
  const history = useHistory();
  // Lifecycle

  // UI
  if (!objectId) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ObjectDetail
      context={context}
      modelKey={model.key}
      objectId={objectId}
      baseUrl={`/explorer/${model.key_plural}`}
      onAfterButtonPress={{
        Delete: () => {
          history.replace(`/explorer/${model.key_plural}`);
          context.canvas.interact.snackbar(
            `${model.label} deleted.`,
            "success"
          );
        },
      }}
    />
  );
};

export default ObjectDetail;
