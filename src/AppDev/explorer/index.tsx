import { AppContext } from "../../Components/Context";
import { AppPageType, ModelType } from "../../Utils/Types";
import B from "./Detail";

const app = {
  // Handlers
  handlers: {
    "object-detail": {
      label: "Open object in explorer",
      url: "/{model.key}/{object._id}",
      accepts: "*",
    },
  },

  // Settings
  settings: {
    pages: { searchable: true, groups: { enabled: true, collapsible: true } },
    mobile: { pages: "bottom" },
  },

  // Pages
  getPages: (context: AppContext) =>
    new Promise<AppPageType[]>((resolve, reject) =>
      context.data.models.getAll((models) => {
        const pages: AppPageType[] = [];
        models.map((model: ModelType) =>
          pages.push({
            label: model.label_plural,
            key: model.key_plural,
            altKeys: [model.key],
            icon: model.icon,
            component: B,
            group: model.app,
            props: { models },
            model: model.key,
          })
        );
        resolve(pages);
      })
    ),
};

export default app;
