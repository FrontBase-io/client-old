import Socket from "../../../../Utils/Socket";
import { ObjectType, ResponseType } from "../../../../Utils/Types";

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

export default { get };
