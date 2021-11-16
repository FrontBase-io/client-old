export const modifyRecursive = (
  array: any[],
  key: string,
  modifyItem: (item: { [key: string]: any } | null) => any,
  extraKeysToSearchFor?: string[]
) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line array-callback-return
    array?.map(async function (item) {
      if (item.key === key) {
        item = modifyItem(item);
        resolve(array);
      } else {
        const result = array;

        // Search for 'extra' 'keys (in case not everything is included in itmes)
        if (extraKeysToSearchFor) {
          //@ts-ignore
          await (extraKeysToSearchFor || []).reduce(async (prev, extraKey) => {
            await prev;

            if (Object.keys(item.args).includes(extraKey)) {
              result[extraKey] = await modifyRecursive(
                [item.args[extraKey]],
                key,
                modifyItem,
                extraKeysToSearchFor
              );
            }

            return extraKey;
          }, (extraKeysToSearchFor || [])[0]);
        }
        //@ts-ignore
        result.items = await modifyRecursive(
          item.items,
          key,
          modifyItem,
          extraKeysToSearchFor
        );
        resolve(result);
      }
    });
  });

export const deepEquals = (x: any, y: any, exceptionName?: any) => {
  if (x === y) {
    return true; // if both x and y are null or undefined and exactly the same
  } else if (!(x instanceof Object) || !(y instanceof Object)) {
    return false; // if they are not strictly equal, they both need to be Objects
  } else if (x.constructor !== y.constructor) {
    // they must have the exact same prototype chain, the closest we can do is
    // test their constructor.
    return false;
  } else {
    for (const p in x) {
      if (!x.hasOwnProperty(p)) {
        continue; // other properties were tested using x.constructor === y.constructor
      }
      if (!y.hasOwnProperty(p)) {
        return false; // allows to compare x[ p ] and y[ p ] when set to undefined
      }
      if (x[p] === y[p] || (!!exceptionName && p === exceptionName)) {
        continue; // if they have the same strict value or identity then they are equal
      }
      if (typeof x[p] !== "object") {
        return false; // Numbers, Strings, Functions, Booleans must be strictly equal
      }
      if (!deepEquals(x[p], y[p])) {
        return false;
      }
    }
    for (const p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  }
};
