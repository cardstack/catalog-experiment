import { default as baseDifference } from "./61.js";
import { default as baseFlatten } from "./85.js";
import { default as baseUniq } from "./63.js";
function baseXor(arrays, iteratee, comparator) {
  var length = arrays.length;

  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }

  var index = -1,
      result = Array(length);

  while (++index < length) {
    var array = arrays[index],
        othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }

  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}
export { baseXor as default };
/*====catalogjs annotation start====
k5OVwqcuLzYxLmpzA8LAlcKnLi84NS5qcwbCwJXCpy4vNjMuanMJwsCBp2RlZmF1bHSVoWynYmFzZVhvchLAwNwAFJehbwAAA8CQwJmhZAkAAsCRAsDCmaFprmJhc2VEaWZmZXJlbmNlkgIOwACnZGVmYXVsdMDAwJihcgsOwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaatiYXNlRmxhdHRlbpIFEMABp2RlZmF1bHTAwMCYoXILC8DAkQTAwpyhaQESBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmoYmFzZVVuaXGTCA0PwAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARIHCpDAwgLCwMCXoW8BAAsRkMCZoWQAJQzAlQ0ODxAMwMKZoWynYmFzZVhvcpIME8DAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VYb3IuanOYoXIJB8ANkQvAwpihcmgIwA6RB8DCmKFyzPUOwA+RAcDCmKFyXgjAEJEHwMKYoXIBC8DAkQTAwpihZwEDEsCQwMKYoWcJCxPAkRPAwpihcgAHwMCRC8DC
====catalogjs annotation end====*/