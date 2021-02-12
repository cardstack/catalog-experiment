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
k5SVwqcuLzg3LmpzA8LAlcKxLi4vaXNBcmd1bWVudHMuanMGwsCVwq0uLi9pc0FycmF5LmpzCcLAlcKoLi8xMzkuanMMwsCBp2RlZmF1bHSVoWyrYmFzZUZsYXR0ZW4gwMDcACKXoW8AAAPAkMCZoWQJAALAkQLAwpmhaadTeW1ib2wwkwIREsAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmraXNBcmd1bWVudHOSBRbAAadkZWZhdWx0wMDAmKFyCwvAwJEEwMKcoWkBHAQJkMDCAcLAwJmhZAkACMCRCMDCmaFpp2lzQXJyYXmSCBXAAqdkZWZhdWx0wMDAmKFyCwfAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqWFycmF5UHVzaJILHsADp2RlZmF1bHTAwMCYoXILCcDAkQrAwpyhaQETCg2QwMIDwsDAl6FvAQAOGZDAmKFnAAEPE5DAwpmhZAQfEMCUERIQDsDCmaFssHNwcmVhZGFibGVTeW1ib2yTEBcYwMDADpDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNGbGF0dGVuYWJsZS5qc5ihcgAQwBGRD8DCmKFyAwfAEpEBwMKYoXIDB8DAkQHAwpmhZAEFFMCWFRYXGBQPwMKZoWytaXNGbGF0dGVuYWJsZZIUHMDAwMCQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2lzRmxhdHRlbmFibGUuanOYoXIJDcAVkRPAwpihchMHwBaRB8DCmKFyCwvAF5EEwMKYoXIOEMAYkQ/AwpihchMQwMCRD8DCl6FvAQAaH5DAmaFkAHcbwJQcHhsdwMKZoWyrYmFzZUZsYXR0ZW6TGx0hwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUZsYXR0ZW4uanOYoXIJC8AckRrAwpihcnkNwB2RE8DCmKFyzKMLwB6RGsDCmKFySAnAwJEKwMKYoWcBAyDAkMDCmKFnCQshwJEhwMKYoXIAC8DAkRrAwg==
====catalogjs annotation end====*/