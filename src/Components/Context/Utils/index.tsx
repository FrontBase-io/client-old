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
  icon?: string
) => {
  const newArray: ListItemType[] = [];
  map(list || {}, (item, key: string) =>
    newArray.push({
      label: item[label],
      key: key,
      icon: icon ? item[icon] : undefined,
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

export const updateByKey = (
  array: { key: string; [key: string]: any }[],
  newItem: { key: string; [key: string]: any }
) => {
  (array || []).forEach(update(newItem.id, newItem));
};

let update =
  (key: string, newItem: { key: string; [key: string]: any }) =>
  (obj: { key: string; [key: string]: any }) => {
    if (obj.id === key) {
      obj = newItem;
      return true;
    } else if (obj.items) return obj.items.some(update(key, newItem));
  };

export default {
  listify,
  listifyObject,
  listifyForSelect,
  listifyObjectForSelect,
  modelListToModelObject,
  update,
  updateByKey,
};
