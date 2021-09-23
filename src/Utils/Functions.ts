export const modifyRecursive = (
  array: { [key: string]: any }[],
  key: string,
  modifyItem: (item: { [key: string]: any }) => {}
) =>
  new Promise<void>((resolve, reject) => {
    // eslint-disable-next-line array-callback-return
    (array || []).map(function (item): void {
      if (item.key === key) {
        item = modifyItem(item);
        resolve();
      } else {
        modifyRecursive(item.items, key, modifyItem);
      }
    });
  });
