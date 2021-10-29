import { AppPageType } from "../../Utils/Types";
import PageModels from "./models";
import SettingsProcesses from "./processes";
import PageSettings from "./settings";
import SettingsUpdate from "./Update";

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
          component: SettingsProcesses,
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
