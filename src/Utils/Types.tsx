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
  type?: "text" | "number" | "relationship" | "formula" | "options";
  required?: boolean;
  unique?: boolean;
  // Options
  selectMultiple?: boolean;
  optionsDisplayAs?: "dropdown" | "list" | string;
  options?: { label: string; value: string }[];
  // Relationship
  relationshipTo?: string;
  // Formula
  formula?: string;
}

// Layout
export interface ModelLayoutType {
  label: string;
  layout: LayoutItemType[];
}

// List
export interface ModelListType {
  label?: string;
  filter?: {};
  fields?: string[];
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
  settings?: { desktop?: {}; mobile?: { pages: "bottom" } };
  getPages: () => Promise<AppPageType[]>;
}
export interface LayoutItemType {
  key?: string;
  label: string;
  type:
    | "Field"
    | "GridContainer"
    | "GridItem"
    | "Animation"
    | "AnimationContainer"
    | "AnimationItem";
  items?: LayoutItemType[];
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
  content?: ReactElement<any, any>;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fields?: {
    [key: string]: {
      type?: "text" | "key" | "custom";
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
      component?: React.FC<any>;
      componentProps?: {};
    };
  };
  actions?: {
    label: string;
    onClick?: (form: { [key: string]: any }, close: () => void) => void;
  }[];
}

export interface SelectOptionType {
  label: string;
  value: string;
}
