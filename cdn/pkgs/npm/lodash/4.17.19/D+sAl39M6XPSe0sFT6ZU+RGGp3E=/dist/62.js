import { default as SetCache } from "./64.js";
import { default as arrayIncludes } from "./120.js";
import { default as arrayIncludesWith } from "./162.js";
import { default as arrayMap } from "./98.js";
import { default as baseUnary } from "./135.js";
import { default as cacheHas } from "./152.js";
var nativeMin = Math.min;
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];

    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }

    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined;
  }

  array = arrays[0];
  var index = -1,
      seen = caches[0];

  outer: while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;
    value = comparator || value !== 0 ? value : 0;

    if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
      othIndex = othLength;

      while (--othIndex) {
        var cache = caches[othIndex];

        if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
          continue outer;
        }
      }

      if (seen) {
        seen.push(computed);
      }

      result.push(value);
    }
  }

  return result;
}
export { baseIntersection as default };
/*====catalogjs annotation start====
k5aVwqcuLzY0LmpzA8LAlcKoLi8xMjAuanMHwsCVwqguLzE2Mi5qcwvCwJXCpy4vOTguanMPwsCVwqguLzEzNS5qcxPCwJXCqC4vMTUyLmpzF8LAgadkZWZhdWx0laFssGJhc2VJbnRlcnNlY3Rpb24owMDcACqXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaahTZXRDYWNoZZICJMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaa1hcnJheUluY2x1ZGVzkgYgwAGnZGVmYXVsdMDAwJihcgsNwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCArAwJDAwpmhZAkACgyRCsDCmaFpsWFycmF5SW5jbHVkZXNXaXRokgofwAKnZGVmYXVsdMDAwJihcgsRwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCArAwJDAwpmhZAkADhCRDsDCmaFpqGFycmF5TWFwkg4hwAOnZGVmYXVsdMDAwJihcgsIwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCAnAwJDAwpmhZAkAEhSREsDCmaFpqWJhc2VVbmFyeZISIsAEp2RlZmF1bHTAwMCYoXILCcDAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgKwMCQwMKZoWQJABYYkRbAwpmhaahjYWNoZUhhc5MWJSbABadkZWZhdWx0wMDAmKFyCwjAwJEVwMKcoWkBARUZkRjAwgXCwMCYoWcICsDAkMDCl6FvAQAaJ5DAmKFnAAEbHZDAwpmhZAQLHMCSHBrAwpmhbKluYXRpdmVNaW6SHCPAwMAakNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW50ZXJzZWN0aW9uLmpzmKFyAAnAwJEbwMKZoWQBzOUewJofICEiIyQlJh4bwMKZoWywYmFzZUludGVyc2VjdGlvbpIeKcDAwMCQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJbnRlcnNlY3Rpb24uanOYoXIJEMAfkR3Awpihcj8RwCCRCcDCmKFyAw3AIZEFwMKYoXLNARkIwCKRDcDCmKFyCAnAI5ERwMKYoXIkCcAkkRvAwpihcnoIwCWRAcDCmKFyzQFBCMAmkRXAwpihcsyzCMDAkRXAwpihZwEDKMCQwMKYoWcJCynAkSnAwpihcgAQwMCRHcDC
====catalogjs annotation end====*/