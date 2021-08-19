import B from "./B";
import PageModels from "./models";

export default class App {
  constructor() {}
  // Settings
  settings = { mobile: { pages: "bottom" } };

  // Pages
  getPages = () =>
    new Promise((resolve, reject) =>
      resolve([
        {
          label: "Models",
          key: "models",
          icon: "account_tree",
          component: PageModels,
          group: "Apps",
        },
        {
          label: "Page B",
          key: "b",
          icon: "self_improvement",
          component: B,
          group: "B",
        },
      ])
    );
}
