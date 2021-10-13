import { AppCodeType } from "../Utils/Types";
import explorer from "./explorer";
import settings from "./settings";

const apps: { [key: string]: AppCodeType } = {
  explorer,
  settings,
};

export default apps;
