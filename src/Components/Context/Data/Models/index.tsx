import Socket from "../../../../Utils/Socket";
import { ModelType, ResponseType } from "../../../../Utils/Types";

const getAll = (respond: (models: ModelType[]) => void) => {
  const onReceive = (models: ModelType[]) => respond(models);
  Socket.emit("getModels", {}, (response: ResponseType) => {
    onReceive(response.models);
    Socket.on(`receive ${response.key}`, onReceive);
  });
};

export default { getAll };
