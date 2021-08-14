export interface ResponseType {
  success: boolean;
  reason?: string;
  key?: string;
  [key: string]: any;
}

export interface ObjectType {
  meta: {};
}

export interface AppObjectType extends ObjectType {
  name: string;
}
