import Socket from "../../../../../Utils/Socket";
import { ResponseType } from "../../../../../Utils/Types";

const get = (key: string, respond: (response: ResponseType) => void) => {
  Socket.emit("getSystemSetting", key, (response: ResponseType) => {
    respond(response);
    Socket.on(`receive ${response.key}`, (response: ResponseType) =>
      respond(response)
    );
  });
};

const systemsettings = { get };

export default systemsettings;
