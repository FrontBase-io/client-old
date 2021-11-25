import FourOhFour from "../../Components/FourOhFour";
import { AppPageType } from "../../Utils/Types";
import AppHub from "./Hub";

const app = {
  // Settings
  settings: {
    pages: { searchable: true },
    mobile: { pages: "bottom" },
  },

  // Pages
  getPages: () =>
    new Promise<AppPageType[]>((resolve) =>
      resolve([
        {
          label: "Hub",
          key: "hub",
          icon: "mobile",
          //@ts-ignore
          component: AppHub,
        },
        {
          label: "Installed apps",
          key: "installed-apps",
          icon: "th-large",
          component: FourOhFour,
        },
      ])
    ),
};

export default app;
