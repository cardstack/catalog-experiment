import { default as assignValue } from "./55.js";
import { default as castPath } from "./17.js";
import { default as isIndex } from "./128.js";
import { default as isObject } from "../isObject.js";
import { default as toKey } from "./27.js";
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }

  path = castPath(path, object);
  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;

      if (newValue === undefined) {
        newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
      }
    }

    assignValue(nested, key, newValue);
    nested = nested[key];
  }

  return object;
}
export { baseSet as default };
/*====catalogjs annotation start====
k5WVwqcuLzU1LmpzA8LAlcKnLi8xNy5qcwbCwJXCqC4vMTI4LmpzCcLAlcKuLi4vaXNPYmplY3QuanMMwsCVwqcuLzI3LmpzD8LAgadkZWZhdWx0laFsp2Jhc2VTZXQawMDcAByXoW8AAAPAkMCZoWQJAALAkQLAwpmhaathc3NpZ25WYWx1ZZICGMAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoY2FzdFBhdGiSBRTAAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBEgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpp2lzSW5kZXiSCBfAAqdkZWZhdWx0wMDAmKFyCwfAwJEHwMKcoWkBEwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqGlzT2JqZWN0kwsTFsADp2RlZmF1bHTAwMCYoXILCMDAkQrAwpyhaQEZCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmldG9LZXmSDhXABKdkZWZhdWx0wMDAmKFyCwXAwJENwMKcoWkBEg0QkMDCBMLAwJehbwEAERmQwJmhZABKEsCXExQVFhcYEsDCmaFsp2Jhc2VTZXSSEhvAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU2V0LmpzmKFyCQfAE5ERwMKYoXIrCMAUkQrAwpihci0IwBWRBMDCmKFyzLEFwBaRDcDCmKFyzO8IwBeRCsDCmKFyGAfAGJEHwMKYoXIwC8DAkQHAwpihZwEDGsCQwMKYoWcJCxvAkRvAwpihcgAHwMCREcDC
====catalogjs annotation end====*/