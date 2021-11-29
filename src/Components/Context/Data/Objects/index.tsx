import Socket from "../../../../Utils/Socket";
import { ObjectType, ResponseType } from "../../../../Utils/Types";

// Create object
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

// Delete object
const trash = (modelKey: string, objectId: string) =>
  new Promise((resolve, reject) => {
    Socket.emit(
      "deleteObject",
      modelKey,
      objectId,
      (response: ResponseType) => {
        response.success ? resolve(response.result) : reject(response.reason);
      }
    );
  });

// Delete many objects
const trashMany = (modelKey: string, objectIds: string[]) =>
  new Promise((resolve, reject) => {
    Socket.emit(
      "deleteObjects",
      modelKey,
      objectIds,
      (response: ResponseType) => {
        response.success ? resolve(response.results) : reject(response.errors);
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

// Get once
const getOnce = (
  modelKey: string,
  filter: {},
  respond: (objects: ObjectType[]) => void
) =>
  new Promise((resolve, reject) => {
    Socket.emit(
      "getObjects",
      modelKey,
      filter || {},
      (response: ResponseType) => {
        resolve(response.objects);
      }
    );
  });

// Get one (convenience function to get a single object)
export const getOne = (
  modelKey: string,
  filter: {},
  respond: (object: ObjectType) => void
) => {
  get(modelKey, filter, (objects) => respond(objects[0]));
};

const getLast = (
  modelKey: string,
  filter: {},
  respond: (object: ObjectType) => void
) => {
  get(modelKey, filter, (objects) => respond(objects[objects.length - 1]));
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

const updateWhere = (
  filter: { [key: string]: any },
  newObject: { [key: string]: any }
) =>
  new Promise((resolve, reject) => {
    Socket.emit(
      "updateObjectsWhere",
      filter,
      newObject,
      (response: ResponseType) => {
        if (response.success) {
          resolve(response.result);
        } else {
          reject(response.reason);
        }
      }
    );
  });

// Turn objectId into modelKey
const turnObjectIdIntoModelKey = (_id: string) =>
  new Promise<string>((resolve, reject) => {
    Socket.emit("turnObjectIdIntoModelKey", _id, (response: ResponseType) =>
      resolve(response.modelKey)
    );
  });

const objectFunctions = {
  create,
  get,
  getOne,
  update,
  trash,
  getLast,
  trashMany,
  turnObjectIdIntoModelKey,
  getOnce,
  updateWhere,
};

export default objectFunctions;
