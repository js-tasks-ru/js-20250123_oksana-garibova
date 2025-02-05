/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const tempPath = path.split('.');
  return (obj) => ((obj.hasOwnProperty(tempPath[0])) ? (tempPath.reduce((acc, val) =>  {return acc ? acc[val] : undefined; }, obj)) : undefined);
}

