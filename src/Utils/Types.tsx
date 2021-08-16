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
}
export interface AppCodeType {
  settings?: { desktop?: {}; mobile?: { pages: "bottom" } };
  getPages: () => Promise<AppPageType[]>;
}
