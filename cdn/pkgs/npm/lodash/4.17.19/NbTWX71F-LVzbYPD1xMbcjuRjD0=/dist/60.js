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
k5OVwqcuLzYxLmpzA8LAlcKnLi84NS5qcwfCwJXCpy4vNjMuanMLwsCBp2RlZmF1bHSVoWynYmFzZVhvchXAwNwAF5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFprmJhc2VEaWZmZXJlbmNlkgIRwACnZGVmYXVsdMDAwJihcgsOwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFpq2Jhc2VGbGF0dGVukgYTwAGnZGVmYXVsdMDAwJihcgsLwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCAnAwJDAwpmhZAkACgyRCsDCmaFpqGJhc2VVbmlxkwoQEsACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgJwMCQwMKXoW8BAA4UkMCZoWQAJQ/AlRAREhMPwMKZoWynYmFzZVhvcpIPFsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VYb3IuanOYoXIJB8AQkQ7AwpihcmgIwBGRCcDCmKFyzPUOwBKRAcDCmKFyXgjAE5EJwMKYoXIBC8DAkQXAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAHwMCRDsDC
====catalogjs annotation end====*/