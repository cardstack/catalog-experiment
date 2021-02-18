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

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

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
k5WVwqcuLzU1LmpzA8LAlcKnLi8xNy5qcwfCwJXCqC4vMTI4LmpzC8LAlcKuLi4vaXNPYmplY3QuanMPwsCVwqcuLzI3LmpzE8LAgadkZWZhdWx0laFsp2Jhc2VTZXQfwMDcACGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaathc3NpZ25WYWx1ZZICHcAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaahjYXN0UGF0aJIGGcABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgJwMCQwMKZoWQJAAoMkQrAwpmhaadpc0luZGV4kgocwAKnZGVmYXVsdMDAwJihcgsHwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCArAwJDAwpmhZAkADhCRDsDCmaFpqGlzT2JqZWN0kw4YG8ADp2RlZmF1bHTAwMCYoXILCMDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgQwMCQwMKZoWQJABIUkRLAwpmhaaV0b0tleZISGsAEp2RlZmF1bHTAwMCYoXILBcDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgJwMCQwMKXoW8BABYekMCZoWQAShfAlxgZGhscHRfAwpmhbKdiYXNlU2V0khcgwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNldC5qc5ihcgkHwBiRFsDCmKFyKwjAGZENwMKYoXItCMAakQXAwpihcsyxBcAbkRHAwpihcs0BWgjAHJENwMKYoXIYB8AdkQnAwpihcjALwMCRAcDCmKFnAQMfwJDAwpihZwkLIMCRIMDCmKFyAAfAwJEWwMI=
====catalogjs annotation end====*/