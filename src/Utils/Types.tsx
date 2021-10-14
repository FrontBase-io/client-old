import { ReactElement } from "react";
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
  meta: { model: string };
  [key: string]: any;
}
export interface PreObjectType {
  // Optional object type before creation
  _id?: string;
  meta?: { model: string };
  [key: string]: any;
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
  layouts: { [key: string]: ModelLayoutType };
  lists: { [key: string]: ModelListType };
  handler?: string;
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

// Field
export interface ModelFieldType {
  label: string;
  type?:
    | "text"
    | "number"
    | "relationship"
    | "relationship_m"
    | "formula"
    | "options"
    | "date";
  required?: boolean;
  unique?: boolean;
  // Text
  displayType?: string;
  // Options
  selectMultiple?: boolean;
  optionsDisplayAs?: "dropdown" | "list" | string;
  options?: { label: string; value: string }[];
  // Relationship
  relationshipTo?: string;
  // Formula
  formula?: string;
  formulaOutputType?: "text" | "number" | "boolean" | "date";
  // Date
  variant?: "date" | "time" | "datetime";
}

// Layout
export interface ModelLayoutType {
  label: string;
  layout: LayoutItemType[];
  factsbar?: string[];
  buttons?: string[];
}

// List
export interface ModelListType {
  label?: string;
  filter?: {};
  fields?: string[];
  actions?: { global: string[]; single: string[]; many: string[] };
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
  component: React.FC<{
    context: AppContext;
    page: AppPageType;
    selectedPageKey: string;
  }>;
  altKeys?: string[];
  props?: { [key: string]: any };
}
export interface AppCodeType {
  handlers?: {
    [key: string]: {
      url: string;
      label: string;
      accepts: string[] | string | "*";
    };
  };
  settings?: {
    desktop?: {};
    mobile?: { pages?: string };
    pages?: {
      searchable?: boolean;
      groups?: { enabled?: boolean; collapsible?: boolean };
    };
  };
  getPages: (context: AppContext) => Promise<AppPageType[]>;
}
export interface LayoutItemType {
  key?: string;
  label: string;
  type: string;
  items?: LayoutItemType[];
  args?: { [key: string]: any };
}

export interface NavBarButtonType {
  label: string;
  icon: string;
  url?: string;
  onClick?: () => void;
}

/* Interface */
export interface ListItemType {
  label: string;
  key: string;
  icon?: string;
  secondary?: string;
  object?: any;
}

export interface DialogType {
  display?: boolean;
  title?: string;
  text?: string | ReactElement<any, any>;
  content?: ReactElement<any, any>;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fields?: {
    [key: string]: DialogFieldType;
  };
  actionValues?: { [key: string]: any };
  actions?: DialogActionType[];
}

export interface DialogActionType {
  label: string | ReactElement<any, any>;
  onClick?: (form: { [key: string]: any }, close: () => void) => void;
}
export interface DialogFieldType {
  type?: "text" | "key" | "number" | "custom";
  label: string;
  value?: string;
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
  valueModifier?: (value: string | number) => string | number;
  component?: React.FC<any>;
  componentProps?: {};
  linkToKeyField?: string;
}

export interface SelectOptionType {
  label: string;
  value: string;
}

export interface ListDetailType {
  context: AppContext;
  selectedKey: string;
  item: ListItemType;
}

// Specific object types
export interface PermissionObjectType extends ObjectType {
  name: string;
  description: string;
}
