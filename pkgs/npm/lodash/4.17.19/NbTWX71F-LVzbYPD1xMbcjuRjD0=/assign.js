import { default as assignValue } from "./dist/55.js";
import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isPrototype } from "./dist/133.js";
import { default as keys } from "./keys.js";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var assign = createAssigner(function (object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }

  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});
export { assign as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvNTUuanMDwsCVwqwuL2Rpc3QvNTQuanMGwsCVwqwuL2Rpc3QvNDguanMJwsCVwrAuL2lzQXJyYXlMaWtlLmpzDMLAlcKtLi9kaXN0LzEzMy5qcw/CwJXCqS4va2V5cy5qcxLCwIGnZGVmYXVsdJShbKZhc3NpZ24nwNwAKZehbwAAA8CRHMCZoWQJAALAkQLAwpihaathc3NpZ25WYWx1ZZICJcAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaapjb3B5T2JqZWN0kgUiwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFprmNyZWF0ZUFzc2lnbmVykggfwAKnZGVmYXVsdMDAmKFyCw7AwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpq2lzQXJyYXlMaWtlkgshwAOnZGVmYXVsdMDAmKFyCwvAwJEKwMKcoWkBGwoPkMDCA8LAwJmhZAkADsCRDsDCmKFpq2lzUHJvdG90eXBlkg4gwASnZGVmYXVsdMDAmKFyCwvAwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmKFppGtleXOSESPABadkZWZhdWx0wMCYoXILBMDAkRDAwpyhaQEUEBOQwMIFwsDAl6FvAQAUJpDAmKFnAAEVF5DAwpmhZAQTFsCSFhTAwpihbKtvYmplY3RQcm90b5IWGsDAwBTZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hc3NpZ24uanOYoXIAC8DAkRXAwpihZwEBGBuQwMKZoWQEDxnAlBoZFxXAwpihbK5oYXNPd25Qcm9wZXJ0eZIZJMDAwBfZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hc3NpZ24uanOYoXIADsAakRjAwpihcgMLwMCRFcDCmKFnAQEcwJDAwpmhZAQAHcCUHRseGMDCmKFspmFzc2lnbpIdKMDAwBvZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hc3NpZ24uanOYoXIABsAekRzAwpihZwMoH8CXHyAhIiMkJcDCmKFyAA7AIJEHwMKYoXIjC8AhkQ3AwpihcgwLwCKRCsDCmKFyEArAI5EEwMKYoXIJBMAkkRDAwpihckgOwCWRGMDCmKFyHAvAwJEBwMKYoWcBAyfAkMDCmKFnCQsowJEowMKYoXIABsDAkRzAwg==
====catalogjs annotation end====*/