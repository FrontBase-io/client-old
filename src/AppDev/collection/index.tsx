import { AppContext } from "../../Components/Context";
import { AppObjectType, AppPageType } from "../../Utils/Types";
import Interface from "./Interface";

const app = {
  // Settings
  settings: {
    pages: { searchable: true },
    mobile: { pages: "bottom" },
  },

  // Pages
  getPages: (context: AppContext, object: AppObjectType) =>
    new Promise<AppPageType[]>((resolve) => {
      const pages: AppPageType[] = [];
      (object.pages || []).map((page) => {
        pages.push({
          label: page.label,
          key: page.key,
          icon: page.icon,
          //@ts-ignore
          component: Interface,
          props: { interfaceKey: page.content.interfaceKey, app: object },
        });
      });

      resolve(pages);
    }),
};

export default app;
