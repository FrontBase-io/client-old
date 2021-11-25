import { ColorType, ModelType, ObjectType } from "@frontbase/types";

export interface APIAppType {
  name: string;
  key: string;
  type: "collection" | "code";
  has_client?: boolean;
  has_server?: boolean;
  install_script?: any[];
  models?: ModelType[];
  objects?: ObjectType[];
  summary: string;
  description: string;
  image: string;
  icon: string;
  color: ColorType;
  data_versions: {};
  app_versions: {};
}
