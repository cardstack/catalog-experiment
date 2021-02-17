import { default as compareAscending } from "./29.js";
import { default as arrayMap } from "./98.js";
import { default as baseIteratee } from "./6.js";
import { default as baseMap } from "./74.js";
import { default as baseUnary } from "./135.js";
import { default as identity } from "../identity.js";
function baseSortBy(array, comparer) {
  var length = array.length;
  array.sort(comparer);

  while (length--) {
    array[length] = array[length].value;
  }

  return array;
}
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);

    if (result) {
      if (index >= ordersLength) {
        return result;
      }

      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }

  return object.index - other.index;
}
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));
  var result = baseMap(collection, function (value, key, collection) {
    var criteria = arrayMap(iteratees, function (iteratee) {
      return iteratee(value);
    });
    return {
      'criteria': criteria,
      'index': ++index,
      'value': value
    };
  });
  return baseSortBy(result, function (object, other) {
    return compareMultiple(object, other, orders);
  });
}
export { baseOrderBy as default };
/*====catalogjs annotation start====
k5aVwqcuLzI5LmpzA8LAlcKnLi85OC5qcwfCwJXCpi4vNi5qcwvCwJXCpy4vNzQuanMPwsCVwqguLzEzNS5qcxPCwJXCri4uL2lkZW50aXR5LmpzF8LAgadkZWZhdWx0laFsq2Jhc2VPcmRlckJ5LMDA3AAul6FvAAADwJDAmaFkCQACBJECwMKZoWmwY29tcGFyZUFzY2VuZGluZ5ICH8AAp2RlZmF1bHTAwMCYoXILEMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaahhcnJheU1hcJMGIyjAAadkZWZhdWx0wMDAmKFyCwjAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcICcDAkMDCmaFkCQAKDJEKwMKZoWmsYmFzZUl0ZXJhdGVlkgomwAKnZGVmYXVsdMDAwJihcgsMwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCAjAwJDAwpmhZAkADhCRDsDCmaFpp2Jhc2VNYXCSDifAA6dkZWZhdWx0wMDAmKFyCwfAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcICcDAkMDCmaFkCQASFJESwMKZoWmpYmFzZVVuYXJ5khIlwASnZGVmYXVsdMDAwJihcgsJwMCREcDCnKFpAQERF5EUwMIEwsDAmKFnCArAwJDAwpmhZAkAFhiRFsDCmaFpqGlkZW50aXR5khYkwAWnZGVmYXVsdMDAwJihcgsIwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCBDAwJDAwpehbwEAGhyQwJmhZADMnhvAkRvAwpmhbKpiYXNlU29ydEJ5khspwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNvcnRCeS5qc5ihcgkKwMCRGsDCl6FvAQAdIJDAmaFkAM0BBB7Akh8ewMKZoWyvY29tcGFyZU11bHRpcGxlkh4qwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY29tcGFyZU11bHRpcGxlLmpzmKFyCQ/AH5EdwMKYoXLM6xDAwJEBwMKXoW8BACErkMCZoWQAICLAmSMkJSYnKCkqIsDCmaFsq2Jhc2VPcmRlckJ5kiItwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZU9yZGVyQnkuanOYoXIJC8AjkSHAwpihckIIwCSRBcDCmKFyIQjAJZEVwMKYoXIDCcAmkRHAwpihcgEMwCeRCcDCmKFyEwfAKJENwMKYoXJECMApkQXAwpihcsy0CsAqkRrAwpihci8PwMCRHcDCmKFnAQMswJDAwpihZwkLLcCRLcDCmKFyAAvAwJEhwMI=
====catalogjs annotation end====*/