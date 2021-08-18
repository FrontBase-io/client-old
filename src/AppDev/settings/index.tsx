import A from "./A";
import B from "./B";

export default class App {
  constructor() {}
  // Settings
  settings = { mobile: { pages: "bottom" } };

  // Pages
  getPages = () =>
    new Promise((resolve, reject) =>
      resolve([
        { label: "Page A", key: "a", icon: "fingerprint", component: A },
        { label: "Page B", key: "b", icon: "self_improvement", component: B },
      ])
    );
}
