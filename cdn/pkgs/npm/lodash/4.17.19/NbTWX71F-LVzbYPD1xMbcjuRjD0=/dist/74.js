import { default as baseEach } from "./75.js";
import { default as isArrayLike } from "../isArrayLike.js";
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];
  baseEach(collection, function (value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}
export { baseMap as default };
/*====catalogjs annotation start====
k5KVwqcuLzc1LmpzA8LAlcKxLi4vaXNBcnJheUxpa2UuanMGwsCBp2RlZmF1bHSVoWynYmFzZU1hcA3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaahiYXNlRWFjaJICC8AAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmraXNBcnJheUxpa2WSBQrAAadkZWZhdWx0wMDAmKFyCwvAwJEEwMKcoWkBHAQHkMDCAcLAwJehbwEACAyQwJmhZADMgQnAkwoLCcDCmaFsp2Jhc2VNYXCSCQ7AwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlTWFwLmpzmKFyCQfACpEIwMKYoXI6C8ALkQTAwpihcjAIwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAfAwJEIwMI=
====catalogjs annotation end====*/