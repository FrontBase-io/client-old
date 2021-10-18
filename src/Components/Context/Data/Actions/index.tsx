import Socket from "../../../../Utils/Socket";
import { ObjectType, ResponseType } from "../../../../Utils/Types";

// Create object
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

const actionFunctions = {
  executeSingleAction,
};

export default actionFunctions;
