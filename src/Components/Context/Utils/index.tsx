import { map } from "lodash";
import { ListItemType } from "../../../Utils/Types";

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

export default { listify, listifyObject };
