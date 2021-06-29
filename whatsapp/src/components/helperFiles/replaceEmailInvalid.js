export function replaceInvalid(str) {
  let newStr = str;
  newStr = newStr.replaceAll(/[.#$[\]]/g, process.env.REACT_APP_measurementId);
  return newStr;
}
