export const modifyRecursive = (
  array: any[],
  key: string,
  modifyItem: (item: { [key: string]: any } | null) => any
) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line array-callback-return
    array?.map(async function (item) {
      if (item.key === key) {
        item = modifyItem(item);
        resolve(array);
      } else {
        const result = array;
        //@ts-ignore
        result.items = await modifyRecursive(item.items, key, modifyItem);
        resolve(result);
      }
    });
  });
