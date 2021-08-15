// Genera
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

export interface AppObjectType extends ObjectType {
  name: string;
  key: string;
  color: ColorType;
}
