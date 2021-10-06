import Socket from "../../../../Utils/Socket";
import { ObjectType, ResponseType } from "../../../../Utils/Types";

const create = (modelKey: string, newObject: {}) =>
  new Promise((resolve, reject) => {
    Socket.emit(
      "createObject",
      modelKey,
      newObject,
      (response: ResponseType) => {
        response.success ? resolve(response.result) : reject(response.reason);
      }
    );
  });

// Get object
const get = (
  modelKey: string,
  filter: {},
  respond: (objects: ObjectType[]) => void
) => {
  const onReceive = (objects: ObjectType[]) => respond(objects);
  Socket.emit(
    "getObjects",
    modelKey,
    filter || {},
    (response: ResponseType) => {
      onReceive(response.objects);
      Socket.on(`receive ${response.key}`, (result) =>
        onReceive(result.objects)
      );
    }
  );
};

// Update object
const update = (_id: string, newObject: { [key: string]: any }) =>
  new Promise((resolve, reject) => {
    Socket.emit("updateObject", _id, newObject, (response: ResponseType) => {
      if (response.success) {
        resolve(response.result);
      } else {
        reject(response.reason);
      }
    });
  });

const updateFunctions = { create, get, update };

export default updateFunctions;
