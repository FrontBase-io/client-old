import { cloneDeep, map } from "lodash";
import { ListItemType, ModelType } from "../../../Utils/Types";
//@ts-ignore
import Formula from "frontbase-formulas";

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

export const listifyForSelect = (
  list: { [key: string]: any }[],
  label: string,
  key: string
) => {
  const newArray: { label: string; value: string; object?: any }[] = [];
  list.map((item) =>
    newArray.push({
      label: item[label],
      value: item[key],
      object: item,
    })
  );
  return newArray;
};

const listifyObjectForSelect = (
  list: { [key: string]: any },
  label: string
) => {
  const newArray: { label: string; value: string; object: any }[] = [];
  map(list || {}, (item, key: string) =>
    newArray.push({
      label: item[label],
      value: key,
      object: item,
    })
  );
  return newArray;
};

const modelListToModelObject = (list: ModelType[]) => {
  const newObject: { [key: string]: ModelType } = {};
  list.map((model) => (newObject[model.key] = model));
  return newObject;
};

const parseFormula = (formulaString: string, data: {}) =>
  new Promise<string>(async (resolve, reject) => {
    const formula = new Formula(formulaString);
    await formula.onParsed;
    resolve(await formula.parse(data));
  });

const parseObjectFormulas = (object: {}, data: {}) =>
  new Promise(async (resolve, reject) => {
    const newObject = cloneDeep(object);
    //@ts-ignore
    await Object.keys(object).reduce(async (prev, curr) => {
      await prev;

      if (object[curr]._form) {
        newObject[curr] = await parseFormula(object[curr]._form, data);
      }
      if (object[curr].value?._form) {
        newObject[curr] = await parseFormula(object[curr].value._form, data);
      }

      return curr;
    }, Object.keys(object)[0]);
    resolve(newObject);
  });

const utils = {
  listify,
  listifyObject,
  listifyForSelect,
  listifyObjectForSelect,
  modelListToModelObject,
  parseFormula,
  parseObjectFormulas,
};
export default utils;
