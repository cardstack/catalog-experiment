import { default as Symbol0 } from "./87.js";
import { default as isArguments } from "../isArguments.js";
import { default as isArray } from "../isArray.js";
import { default as arrayPush } from "./139.js";
var spreadableSymbol = Symbol0 ? Symbol0.isConcatSpreadable : undefined;
function isFlattenable(value) {
  return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];

    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }

  return result;
}
export { baseFlatten as default };
/*====catalogjs annotation start====
k5SVwqcuLzg3LmpzA8LAlcKxLi4vaXNBcmd1bWVudHMuanMHwsCVwq0uLi9pc0FycmF5LmpzC8LAlcKoLi8xMzkuanMPwsCBp2RlZmF1bHSVoWyrYmFzZUZsYXR0ZW4kwMDcACaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaadTeW1ib2wwkwIVFsAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaatpc0FyZ3VtZW50c5IGGsABp2RlZmF1bHTAwMCYoXILC8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgTwMCQwMKZoWQJAAoMkQrAwpmhaadpc0FycmF5kgoZwAKnZGVmYXVsdMDAwJihcgsHwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFpqWFycmF5UHVzaJIOIsADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgKwMCQwMKXoW8BABIdkMCYoWcAARMXkMDCmaFkBB8UwJQVFhQSwMKZoWywc3ByZWFkYWJsZVN5bWJvbJMUGxzAwMASkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc0ZsYXR0ZW5hYmxlLmpzmKFyABDAFZETwMKYoXIDB8AWkQHAwpihcgMHwMCRAcDCmaFkAQUYwJYZGhscGBPAwpmhbK1pc0ZsYXR0ZW5hYmxlkhggwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNGbGF0dGVuYWJsZS5qc5ihcgkNwBmRF8DCmKFyEwfAGpEJwMKYoXILC8AbkQXAwpihcg4QwByRE8DCmKFyExDAwJETwMKXoW8BAB4jkMCZoWQAdx/AlCAiHyHAwpmhbKtiYXNlRmxhdHRlbpMfISXAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlRmxhdHRlbi5qc5ihcgkLwCCRHsDCmKFyeQ3AIZEXwMKYoXLMowvAIpEewMKYoXJICcDAkQ3AwpihZwEDJMCQwMKYoWcJCyXAkSXAwpihcgALwMCRHsDC
====catalogjs annotation end====*/