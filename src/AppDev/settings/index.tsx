import { AppPageType } from "../../Utils/Types";
import PageApps from "./apps";
import PageInterfaces from "./interfaces";
import PageModels from "./models";
import SettingsProcesses from "./processes";
import PageSettings from "./settings";
import SettingsUpdate from "./update";

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
          label: "Apps",
          key: "apps",
          icon: "mobile",
          component: PageApps,
          group: "Apps",
        },
        {
          label: "Models",
          key: "models",
          icon: "sitemap",
          component: PageModels,
          group: "Apps",
        },

        {
          label: "Processes",
          key: "processes",
          icon: "code-branch",
          component: SettingsProcesses,
          group: "Apps",
        },
        {
          label: "Interfaces",
          key: "interfaces",
          icon: "desktop",
          component: PageInterfaces,
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
          component: SettingsUpdate,
          group: "System",
        },
      ])
    ),
};

export default app;
