import Socket from "../../../../../Utils/Socket";
import { ResponseType } from "../../../../../Utils/Types";

const get = (key: string, respond: (response: ResponseType) => void) => {
  Socket.emit("getSystemSetting", key, (response: ResponseType) => {
    respond(response.value);
    Socket.on(`receive ${response.key}`, (response: ResponseType) =>
      respond(response.value)
    );
  });
};

const systemsettings = { get };

export default systemsettings;
