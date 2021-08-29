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
  icon: string;
  locked?: boolean;
  fields: { [key: string]: ModelFieldType };
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

export interface ModelFieldType {
  label: string;
}

// Apps
export interface AppObjectType extends ObjectType {
  icon: string;
  name: string;
  key: string;
  color: ColorType;
}
export interface AppPageType {
  label: string;
  key: string;
  icon: string;
  group?: string;
  component: React.FC<{ context: AppContext; page: AppPageType }>;
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
  object?: any;
}

export interface DialogType {
  display?: boolean;
  title?: string;
  text?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fields?: {
    [key: string]: {
      type?: "text" | "key";
      label: string;
      width?:
        | false
        | "auto"
        | true
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12;
    };
  };
  actions?: {
    label: string;
    onClick?: (form: { [key: string]: any }, close: () => void) => void;
  }[];
}
