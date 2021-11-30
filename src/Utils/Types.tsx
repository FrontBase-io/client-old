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
    | "date"
    | "color"
    | "image"
    | "file"
    | "free-data"
    | "boolean";
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
  factsbar?: {
    title?: string;
    color?: string;
    image?: string;
    fields?: string[];
  };
  buttons?: string[];
}

// List
export interface ModelListType {
  label?: string;
  filter?: {};
  fields?: string[];
  actions?: {
    global?: ModelListActionType[];
    single?: ModelListActionType[];
    many?: ModelListActionType[];
  };
}
export interface ModelListActionType {
  key: string;
  label: string;
  icon: string;
  type: "process" | "action";
}

// Apps
export interface AppObjectType extends ObjectType {
  icon: string;
  name: string;
  key: string;
  color: ColorType;
  type: "collection" | "code";
  pages: {
    key: string;
    label: string;
    icon: string;
    content: {
      type: "model" | "interface";
      // Interface
      interfaceKey?: string;
      // Model
      model?: string;
    };
  }[];
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
  model?: string;
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
  items?: ListItemType[];
}

export interface DialogType {
  display?: boolean;
  title?: string;
  text?: string | ReactElement<any, any>;
  content?: (
    close: () => void
  ) => ReactElement<any, any> | ReactElement<any, any>;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fields?: {
    [key: string]: DialogFieldType;
  };
  actionValues?: { [key: string]: any };
  actions?: DialogActionType[];
  withoutPadding?: true;
}

export interface DialogActionType {
  label: string | ReactElement<any, any>;
  onClick?: (form: { [key: string]: any }, close: () => void) => void;
}
export interface DialogFieldType {
  type?: "text" | "key" | "number" | "options" | "boolean" | "custom";
  label: string;
  value?: any;
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
  valueModifier?: (
    value: string | number | boolean
  ) => string | number | boolean;
  explanation?: string;
  // Custom
  component?: React.FC<any>;
  componentProps?: {};
  linkToKeyField?: string;
  // Options
  options?: SelectOptionType[];
  // Conditional fields
  onlyDisplayWhen?: {
    and?: { [key: string]: any };
    or?: { [key: string]: any }[];
  };
}

export interface SelectOptionType {
  label: string;
  value: string;
  object?: any;
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
export interface SystemTaskObjectType extends ObjectType {
  description: string;
  type: "system-update";
  done: boolean;
  progress: number;
}

// Processes
export interface ProcessObjectType extends ObjectType {
  name: string;
  description: string;
  logic: ProcesLogicStepItemType[];
  variables?: { [key: string]: ProcessVariableType };
  triggers?: ProcessTriggersType;
}

export interface ProcesLogicStepItemType {
  id: string;
  type: string;
  data: { type: string; label: string; formula?: {} };
  position: { x: number; y: number };
}

export interface ProcessVariableType {
  label: string;
  type: string;
  recordModel?: string;
  isInput?: boolean;
  isOutput?: boolean;
}
export interface ProcessTriggerType {
  label: string;
  // Change
  modelKey?: string;
  fields?: string[];
  oldObject?: string;
  newObject?: string;
  output?: string;
  operations?: string[];

  // Action
  input?: string;

  // Time
  trigger?: string;
  customTrigger?: string;
}

export interface ProcessTriggersType {
  beforeChange?: ProcessTriggerType[];
  afterChange?: ProcessTriggerType[];
  time?: ProcessTriggerType[];
  globalAction?: ProcessTriggerType[];
  singleAction?: ProcessTriggerType[];
  manyAction?: ProcessTriggerType[];
}

// Interfaces
export interface InterfaceObjectType extends ObjectType {
  name: string;
  key: string;
  description: string;
  variables?: { [key: string]: InterfaceobjectVariableType };
  layout?: LayoutItemType[];
  actions?: { [key: string]: InterfaceobjectActionType };
}

export interface InterfaceobjectVariableType {
  label: string;
  type?: "objects" | "object" | "text" | "number" | "boolean";
  model?: string;
}

export interface InterfaceobjectActionType {
  label: string;
  description?: string;
  actions?: InterfaceActionStepType[];
}
export interface InterfaceActionStepType {
  type: "default" | "input" | "output";
  data: {
    type: "create_objects" | "assign_values" | "update_objects";
    args?: {
      // Create objects
      mode?: "m" | "v";
      model?: string;
      newObject?: ObjectType;
      // Assign values:
      values?: { [key: string]: any };
      // Update values
      filter?: { [key: string]: any };
      fields?: { [key: string]: any };
    };
  };
}

export interface UserObjectType extends ObjectType {
  first_name: string;
  last_name: string;
  full_name: string;
  person: string;
  teams: string[];
  roles: string[];
  image?: string;
}
