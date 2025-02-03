/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let newArray = string.split('');
  let newArray2 = [];
  let count = 0;
  if (size == undefined) {
    return string;
  } else { if (!(size == 0)) {
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i] == newArray[i + 1]) {
        count += 1;
        if (count < size) {
          newArray2.push(newArray[i]);
        }
      } else {
        count = 0;
        newArray2.push(newArray[i]);
      }
    }
  }
  return newArray2.join('');
  }
}




