import Socket from "../../../../Utils/Socket";
import { ObjectType, ResponseType } from "../../../../Utils/Types";

// Single action
const executeSingleAction = (actionId: string, object: ObjectType) =>
  new Promise((resolve, reject) => {
    Socket.emit(
      "executeSingleAction",
      actionId,
      object,
      (response: ResponseType) => {
        response.success ? resolve(response.result) : reject(response.reason);
      }
    );
  });

// Many action
const executeManyAction = (actionId: string, objects: ObjectType[]) =>
  new Promise((resolve, reject) => {
    Socket.emit(
      "executeManyAction",
      actionId,
      objects,
      (response: ResponseType) => {
        response.success ? resolve(response.result) : reject(response.reason);
      }
    );
  });

// Many action
const executeAppAction = (
  appKey: string,
  actionKey: string,
  args: { [key: string]: any }
) =>
  new Promise((resolve, reject) => {
    console.log("emitting");

    Socket.emit(
      "executeAppAction",
      appKey,
      actionKey,
      args,
      (response: ResponseType) => {
        response.success ? resolve(response.result) : reject(response.reason);
      }
    );
  });

const actionFunctions = {
  executeSingleAction,
  executeManyAction,
  executeAppAction,
};

export default actionFunctions;
