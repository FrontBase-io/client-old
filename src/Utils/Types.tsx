import { AppContext } from "../Components/Context";

// General
export interface ColorType {
  r: number;
  g: number;
  b: number;
}

export interface ResponseType {
  success: boolean;
  reason?: string;
  key?: string;
  [key: string]: any;
}

export interface ObjectType {
  _id: string;
  meta: {};
}

/* Models */
export interface ModelType {
  _id: string;
  key: string;
  key_plural: string;
  label: string;
  label_plural: string;
  app: string;
  primary: string;
  locked?: boolean;
  permissions: {
    create: string[];
    read: string[];
    read_own: string[];
    update: string[];
    update_own: string[];
    delete: string[];
    delete_own: string[];
  };
}

// Apps
export interface AppObjectType extends ObjectType {
  name: string;
  key: string;
  color: ColorType;
}
export interface AppPageType {
  label: string;
  key: string;
  icon: string;
  group?: string;
  component: React.FC<{ context: AppContext }>;
}
export interface AppCodeType {
  settings?: { desktop?: {}; mobile?: { pages: "bottom" } };
  getPages: () => Promise<AppPageType[]>;
}

/* Interface */
export interface ListItemType {
  label: string;
  key: string;
  icon?: string;
}
