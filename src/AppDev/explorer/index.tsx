import { AppContext } from "../../Components/Context";
import { AppPageType, ModelType } from "../../Utils/Types";
import B from "./Detail";

export default class App {
  constructor() {}
  // Settings
  settings = {
    pages: { searchable: true, groups: { enabled: true, collapsible: true } },
    mobile: { pages: "bottom" },
  };

  // Pages
  getPages = (context: AppContext) =>
    new Promise((resolve, reject) =>
      context.data.models.getAll((models) => {
        const pages: AppPageType[] = [];
        models.map((model: ModelType) =>
          pages.push({
            label: model.label_plural,
            key: model.key_plural,
            icon: model.icon,
            component: B,
            group: model.app,
          })
        );
        resolve(pages);
      })
    );
}
