import { default as overArg } from "./138.js";
import { default as isPrototype } from "./133.js";
var nativeKeys = overArg(Object.keys, Object);
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty0.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }

  return result;
}
export { baseKeys as default };
/*====catalogjs annotation start====
k5KVwqguLzEzOC5qcwPCwJXCqC4vMTMzLmpzB8LAgadkZWZhdWx0laFsqGJhc2VLZXlzHcDA3AAfl6FvAAADwJELwJmhZAkAAgSRAsDCmaFpp292ZXJBcmeSAg7AAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICsDAkMDCmaFkCQAGCJEGwMKZoWmraXNQcm90b3R5cGWSBhnAAadkZWZhdWx0wMDAmKFyCwvAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcICsDAkMDCl6FvAQAKD5DAmKFnAAELwJDAwpmhZAQADMCTDAoNwMKZoWyqbmF0aXZlS2V5c5IMGsDAwAqQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX25hdGl2ZUtleXMuanOYoXIACsANkQvAwpihZwMVDsCRDsDCmKFyAAfAwJEBwMKXoW8BABAckMCYoWcAARETkMDCmaFkBBMSwJISEMDCmaFsq29iamVjdFByb3RvkhIWwMDAEJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUtleXMuanOYoXIAC8DAkRHAwpihZwEBFBeQwMKZoWQEDxXAlBYVExHAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSFRvAwMATkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlS2V5cy5qc5ihcgAPwBaRFMDCmKFyAwvAwJERwMKZoWQBYxjAlRkaGxgUwMKZoWyoYmFzZUtleXOSGB7AwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlS2V5cy5qc5ihcgkIwBmRF8DCmKFyEgvAGpEFwMKYoXIXCsAbkQvAwpihck8PwMCRFMDCmKFnAQMdwJDAwpihZwkLHsCRHsDCmKFyAAjAwJEXwMI=
====catalogjs annotation end====*/