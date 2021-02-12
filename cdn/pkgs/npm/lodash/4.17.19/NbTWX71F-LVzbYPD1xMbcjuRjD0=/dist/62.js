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
k5aVwqcuLzY0LmpzA8LAlcKoLi8xMjAuanMGwsCVwqguLzE2Mi5qcwnCwJXCpy4vOTguanMMwsCVwqguLzEzNS5qcw/CwJXCqC4vMTUyLmpzEsLAgadkZWZhdWx0laFssGJhc2VJbnRlcnNlY3Rpb24iwMDcACSXoW8AAAPAkMCZoWQJAALAkQLAwpmhaahTZXRDYWNoZZICHsAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmtYXJyYXlJbmNsdWRlc5IFGsABp2RlZmF1bHTAwMCYoXILDcDAkQTAwpyhaQETBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmxYXJyYXlJbmNsdWRlc1dpdGiSCBnAAqdkZWZhdWx0wMDAmKFyCxHAwJEHwMKcoWkBEwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqGFycmF5TWFwkgsbwAOnZGVmYXVsdMDAwJihcgsIwMCRCsDCnKFpARIKD5DAwgPCwMCZoWQJAA7AkQ7AwpmhaaliYXNlVW5hcnmSDhzABKdkZWZhdWx0wMDAmKFyCwnAwJENwMKcoWkBEw0SkMDCBMLAwJmhZAkAEcCREcDCmaFpqGNhY2hlSGFzkxEfIMAFp2RlZmF1bHTAwMCYoXILCMDAkRDAwpyhaQETEBOQwMIFwsDAl6FvAQAUIZDAmKFnAAEVF5DAwpmhZAQLFsCSFhTAwpmhbKluYXRpdmVNaW6SFh3AwMAUkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW50ZXJzZWN0aW9uLmpzmKFyAAnAwJEVwMKZoWQBzOUYwJoZGhscHR4fIBgVwMKZoWywYmFzZUludGVyc2VjdGlvbpIYI8DAwMCQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJbnRlcnNlY3Rpb24uanOYoXIJEMAZkRfAwpihcj8RwBqRB8DCmKFyAw3AG5EEwMKYoXLNARkIwByRCsDCmKFyCAnAHZENwMKYoXIkCcAekRXAwpihcnoIwB+RAcDCmKFyzQFBCMAgkRDAwpihcsyzCMDAkRDAwpihZwEDIsCQwMKYoWcJCyPAkSPAwpihcgAQwMCRF8DC
====catalogjs annotation end====*/