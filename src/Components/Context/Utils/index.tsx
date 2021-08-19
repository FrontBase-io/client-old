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
    })
  );
  return newArray;
};
export default { listify };
