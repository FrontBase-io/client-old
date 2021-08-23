import { AppObjectType } from "../../Utils/Types";
import Design from "../Design";
import Loading from "../Loading";
import Data from "./Data";
import Layouts from "./UI/Layouts";
import Utils from "./Utils";

interface uplinkType {
  url: string;
}
interface CanvasType {
  name: { set: (name?: string) => void; get: string };
  up: {
    set: (link: uplinkType | undefined) => void;
    get: uplinkType | undefined;
  };
}

export class AppContext {
  // This class holds most that is required for rendering an app
  // Interactor with the server
  // UI elements
  // A way to control the canvas
  appData: AppObjectType;
  canvas: CanvasType = {
    name: { set: () => {}, get: "FrontBase" },
    up: { set: () => {}, get: undefined },
  };
  UI = { Design, Layouts, Loading };
  data = Data;
  utils = Utils;

  constructor(appData: AppObjectType, canvas: CanvasType) {
    this.appData = appData;
    this.canvas = canvas;
  }
}
