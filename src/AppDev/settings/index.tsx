export default class App {
  constructor() {}
  // Settings
  settings = { mobile: { pages: "bottom" } };

  // Pages
  getPages = () =>
    new Promise((resolve, reject) =>
      resolve([{ label: "Option a", key: "a", icon: "setings" }])
    );
}
