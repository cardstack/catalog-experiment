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
k5aVwqcuLzI5LmpzA8LAlcKnLi85OC5qcwbCwJXCpi4vNi5qcwnCwJXCpy4vNzQuanMMwsCVwqguLzEzNS5qcw/CwJXCri4uL2lkZW50aXR5LmpzEsLAgadkZWZhdWx0laFsq2Jhc2VPcmRlckJ5JsDA3AAol6FvAAADwJDAmaFkCQACwJECwMKZoWmwY29tcGFyZUFzY2VuZGluZ5ICGcAAp2RlZmF1bHTAwMCYoXILEMDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYXJyYXlNYXCTBR0iwAGnZGVmYXVsdMDAwJihcgsIwMCRBMDCnKFpARIECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaxiYXNlSXRlcmF0ZWWSCCDAAqdkZWZhdWx0wMDAmKFyCwzAwJEHwMKcoWkBEQcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpp2Jhc2VNYXCSCyHAA6dkZWZhdWx0wMDAmKFyCwfAwJEKwMKcoWkBEgoPkMDCA8LAwJmhZAkADsCRDsDCmaFpqWJhc2VVbmFyeZIOH8AEp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQETDRKQwMIEwsDAmaFkCQARwJERwMKZoWmoaWRlbnRpdHmSER7ABadkZWZhdWx0wMDAmKFyCwjAwJEQwMKcoWkBGRATkMDCBcLAwJehbwEAFBaQwJmhZADMnhXAkRXAwpmhbKpiYXNlU29ydEJ5khUjwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNvcnRCeS5qc5ihcgkKwMCRFMDCl6FvAQAXGpDAmaFkAM0BBBjAkhkYwMKZoWyvY29tcGFyZU11bHRpcGxlkhgkwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY29tcGFyZU11bHRpcGxlLmpzmKFyCQ/AGZEXwMKYoXLM6xDAwJEBwMKXoW8BABslkMCZoWQAIBzAmR0eHyAhIiMkHMDCmaFsq2Jhc2VPcmRlckJ5khwnwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZU9yZGVyQnkuanOYoXIJC8AdkRvAwpihckIIwB6RBMDCmKFyIQjAH5EQwMKYoXIDCcAgkQ3AwpihcgEMwCGRB8DCmKFyEwfAIpEKwMKYoXJECMAjkQTAwpihcsy0CsAkkRTAwpihci8PwMCRF8DCmKFnAQMmwJDAwpihZwkLJ8CRJ8DCmKFyAAvAwJEbwMI=
====catalogjs annotation end====*/