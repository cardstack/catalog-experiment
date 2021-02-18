import { default as compareAscending } from "./29.js";
import { default as arrayMap } from "./98.js";
import { default as baseGet } from "./14.js";
import { default as baseIteratee } from "./6.js";
import { default as baseMap } from "./74.js";
import { default as baseUnary } from "./135.js";
import { default as identity } from "../identity.js";
import { default as isArray } from "../isArray.js";
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
  if (iteratees.length) {
    iteratees = arrayMap(iteratees, function (iteratee) {
      if (isArray(iteratee)) {
        return function (value) {
          return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
        };
      }

      return iteratee;
    });
  } else {
    iteratees = [identity];
  }

  var index = -1;
  iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
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
k5iVwqcuLzI5LmpzA8LAlcKnLi85OC5qcwfCwJXCpy4vMTQuanMLwsCVwqYuLzYuanMPwsCVwqcuLzc0LmpzE8LAlcKoLi8xMzUuanMXwsCVwq4uLi9pZGVudGl0eS5qcxvCwJXCrS4uL2lzQXJyYXkuanMfwsCBp2RlZmF1bHSVoWyrYmFzZU9yZGVyQnk3wMDcADmXoW8AAAPAkMCZoWQJAAIEkQLAwpmhabBjb21wYXJlQXNjZW5kaW5nkgInwACnZGVmYXVsdMDAwJihcgsQwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFpqGFycmF5TWFwlAYrLzPAAadkZWZhdWx0wMDAmKFyCwjAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcICcDAkMDCmaFkCQAKDJEKwMKZoWmnYmFzZUdldJIKLcACp2RlZmF1bHTAwMCYoXILB8DAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgJwMCQwMKZoWQJAA4QkQ7AwpmhaaxiYXNlSXRlcmF0ZWWSDjHAA6dkZWZhdWx0wMDAmKFyCwzAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcICMDAkMDCmaFkCQASFJESwMKZoWmnYmFzZU1hcJISMsAEp2RlZmF1bHTAwMCYoXILB8DAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgJwMCQwMKZoWQJABYYkRbAwpmhaaliYXNlVW5hcnmSFjDABadkZWZhdWx0wMDAmKFyCwnAwJEVwMKcoWkBARUbkRjAwgXCwMCYoWcICsDAkMDCmaFkCQAaHJEawMKZoWmoaWRlbnRpdHmSGi7ABqdkZWZhdWx0wMDAmKFyCwjAwJEZwMKcoWkBARkfkRzAwgbCwMCYoWcIEMDAkMDCmaFkCQAeIJEewMKZoWmnaXNBcnJheZIeLMAHp2RlZmF1bHTAwMCYoXILB8DAkR3AwpyhaQEBHSGRIMDCB8LAwJihZwgPwMCQwMKXoW8BACIkkMCZoWQAzJ4jwJEjwMKZoWyqYmFzZVNvcnRCeZIjNMDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VTb3J0QnkuanOYoXIJCsDAkSLAwpehbwEAJSiQwJmhZADNAQQmwJInJsDCmaFsr2NvbXBhcmVNdWx0aXBsZZImNcDAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NvbXBhcmVNdWx0aXBsZS5qc5ihcgkPwCeRJcDCmKFyzOsQwMCRAcDCl6FvAQApNpDAmaFkACAqwJwrLC0uLzAxMjM0NSrAwpmhbKtiYXNlT3JkZXJCeZIqOMDAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VPcmRlckJ5LmpzmKFyCQvAK5EpwMKYoXJMCMAskQXAwpihciwHwC2RHcDCmKFyQQfALpEJwMKYoXLMiAjAL5EZwMKYoXIoCMAwkQXAwpihcgwJwDGRFcDCmKFyAQzAMpENwMKYoXITB8AzkRHAwpihckQIwDSRBcDCmKFyzLQKwDWRIsDCmKFyLw/AwJElwMKYoWcBAzfAkMDCmKFnCQs4wJE4wMKYoXIAC8DAkSnAwg==
====catalogjs annotation end====*/