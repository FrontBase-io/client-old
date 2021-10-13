import Socket from "../../../../Utils/Socket";
import { ModelType, ResponseType } from "../../../../Utils/Types";

const get = (key: string, respond: (model: ModelType) => void) => {
  const onReceive = (model: ModelType) => respond(model);
  Socket.emit("getModel", key, (response: ResponseType) => {
    onReceive(response.model);
    Socket.on(`receive ${response.key}`, (result) => onReceive(result.model));
  });
};

const getAll = (respond: (models: ModelType[]) => void) => {
  const onReceive = (models: ModelType[]) => respond(models);
  Socket.emit("getModels", {}, (response: ResponseType) => {
    onReceive(response.models);
    Socket.on(`receive ${response.key}`, (result) => onReceive(result.models));
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

const modelFunctions = { getAll, update, get };
export default modelFunctions;
