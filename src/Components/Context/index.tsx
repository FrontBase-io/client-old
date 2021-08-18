import { AppObjectType } from "../../Utils/Types";

interface uplinkType {
  title: string;
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

  constructor(appData: AppObjectType, canvas: CanvasType) {
    this.appData = appData;
    this.canvas = canvas;
  }
}
