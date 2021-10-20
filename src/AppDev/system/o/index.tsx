import { useEffect } from "react";
import Loading from "../../../Components/Loading";
import objectFunctions from "../../../Components/Context/Data/Objects";
import modelFunctions from "../../../Components/Context/Data/Models";
import apps from "../../index";
import { ModelType } from "../../../Utils/Types";
import { useHistory } from "react-router";

// This react component is shown once we open a hotlink page (/o/[id])
// It selects the system wide selected handler and redirects the user to that page.
const O: React.FC<{ id: string }> = ({ id }) => {
  // Vars
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    objectFunctions.turnObjectIdIntoModelKey(id).then((modelKey) => {
      modelFunctions.get(modelKey, (model: ModelType) => {
        objectFunctions.get(modelKey, { _id: id }, (objects) => {
          const object = objects[0];
          const handler = model.handler || "explorer-object-detail";
          const handlerApp = handler.split("-")[0];
          const handlerId = handler.replace(handlerApp + "-", "");
          const handlerUrl = `/${handlerApp}${
            apps[handlerApp].handlers![handlerId].url
          }`;
          history.replace(
            handlerUrl.replace(/{(.*?)}/gm, (a) => {
              const tagContent = a.substr(1, a.length - 2);
              const modelOrObject = tagContent.split(".")[0];
              const field = tagContent.replace(`${modelOrObject}.`, "");

              //@ts-ignore
              return modelOrObject === "model" ? model[field] : object[field];
            })
          );
        });
      });
    });
  }, [history, id]);

  // UI
  return <Loading />;
};

export default O;
