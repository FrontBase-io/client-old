import { AppObjectType } from "../../Utils/Types";
import Design from "../Design";
import Inputs from "../Inputs";
import Loading from "../Loading";
import Data from "./Data";
import Layouts from "./UI/Layouts";
import Utils from "./Utils";
import { VariantType } from "notistack";

interface CanvasType {
  name: { set: (name?: string) => void; get: string };
  up: {
    set: (link: string | undefined) => void;
    get: string | undefined;
  };
  interact: { snackbar: (msg: string, variant: VariantType) => void };
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
    interact: { snackbar: () => {} },
  };
  UI = { Design, Layouts, Loading, Inputs };
  data = Data;
  utils = Utils;

  constructor(appData: AppObjectType, canvas: CanvasType) {
    this.appData = appData;
    this.canvas = canvas;
  }
}
