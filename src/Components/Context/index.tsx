import { AppObjectType, DialogType, NavBarButtonType } from "../../Utils/Types";
import Design from "../Design";
import Inputs from "../Inputs";
import Loading from "../Loading";
import Data from "./Data";
import Layouts from "./UI/Layouts";
import Utils from "./Utils";
import { VariantType } from "notistack";
import UIData from "./UI/Data";

interface CanvasType {
  navbar: {
    up: (link: (() => void) | string | undefined) => void;
    name: (name?: string) => void;
    actions: {
      add: (key: string, action: NavBarButtonType) => void;
      remove: (key: string) => void;
    };
  };

  interact: {
    snackbar: (msg: string, variant: VariantType) => void;
    dialog: (dialog: DialogType) => void;
  };
}

export class AppContext {
  // This class holds most that is required for rendering an app
  // Interactor with the server
  // UI elements
  // A way to control the canvas
  appData: AppObjectType;
  canvas: CanvasType = {
    navbar: {
      name: () => {},
      up: () => {},
      actions: {
        add: () => {},
        remove: () => {},
      },
    },
    interact: { snackbar: () => {}, dialog: () => {} },
  };
  UI = { Data: UIData, Design, Layouts, Loading, Inputs };
  data = Data;
  utils = Utils;

  constructor(appData: AppObjectType, canvas: CanvasType) {
    this.appData = appData;
    this.canvas = canvas;
  }
}
