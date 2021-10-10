import { map } from "lodash";
import { ListItemType, ModelType } from "../../../Utils/Types";

const listify = (
  list: { [key: string]: any }[],
  label: string,
  key: string,
  icon?: string
) => {
  const newArray: ListItemType[] = [];
  list.map((item) =>
    newArray.push({
      label: item[label],
      key: item[key],
      icon: icon ? item[icon] : undefined,
      object: item,
    })
  );
  return newArray;
};

const listifyObject = (
  list: { [key: string]: any },
  label: string,
  icon?: string,
  secondary?: string
) => {
  const newArray: ListItemType[] = [];
  map(list || {}, (item, key: string) =>
    newArray.push({
      label: item[label],
      key: key,
      icon: icon ? item[icon] : undefined,
      secondary: secondary ? item[secondary] : undefined,
      object: item,
    })
  );
  return newArray;
};

const listifyForSelect = (
  list: { [key: string]: any }[],
  label: string,
  key: string
) => {
  const newArray: { label: string; value: string }[] = [];
  list.map((item) =>
    newArray.push({
      label: item[label],
      value: item[key],
    })
  );
  return newArray;
};

const listifyObjectForSelect = (
  list: { [key: string]: any },
  label: string
) => {
  const newArray: { label: string; value: string }[] = [];
  map(list || {}, (item, key: string) =>
    newArray.push({
      label: item[label],
      value: key,
    })
  );
  return newArray;
};

const modelListToModelObject = (list: ModelType[]) => {
  const newObject: { [key: string]: ModelType } = {};
  list.map((model) => (newObject[model.key] = model));
  return newObject;
};

const utils = {
  listify,
  listifyObject,
  listifyForSelect,
  listifyObjectForSelect,
  modelListToModelObject,
};
export default utils;
