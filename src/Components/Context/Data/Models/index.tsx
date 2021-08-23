import Socket from "../../../../Utils/Socket";
import { ModelType, ResponseType } from "../../../../Utils/Types";

const getAll = (respond: (models: ModelType[]) => void) => {
  const onReceive = (models: ModelType[]) => respond(models);
  Socket.emit("getModels", {}, (response: ResponseType) => {
    onReceive(response.models);
    Socket.on(`receive ${response.key}`, onReceive);
  });
};

const update = (model: {}) =>
  new Promise<void>((resolve, reject) => {
    Socket.emit("updateModel", model, (response: ResponseType) => {
      if (response.success) {
        resolve();
      } else {
        reject(response.reason);
      }
    });
  });

export default { getAll, update };
