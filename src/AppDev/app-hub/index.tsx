import FourOhFour from "../../Components/FourOhFour";
import { AppPageType } from "../../Utils/Types";

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
          component: FourOhFour,
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
