import { AppPageType } from "../../Utils/Types";
import B from "./B";
import PageModels from "./models";
import PageSettings from "./settings";

const app = {
  // Settings
  settings: {
    pages: { searchable: true, groups: { enabled: true, collapsible: true } },
    mobile: { pages: "bottom" },
  },

  // Pages
  getPages: () =>
    new Promise<AppPageType[]>((resolve) =>
      resolve([
        {
          label: "Models",
          key: "models",
          icon: "sitemap",
          component: PageModels,
          group: "Apps",
        },
        {
          label: "Routines",
          key: "routines",
          icon: "code-branch",
          component: B,
          group: "Apps",
        },
        {
          label: "Settings",
          key: "settings",
          icon: "cogs",
          component: PageSettings,
          group: "System",
        },
        {
          label: "Update",
          key: "update",
          icon: "cloud-download-alt",
          component: B,
          group: "System",
        },
      ])
    ),
};

export default app;
