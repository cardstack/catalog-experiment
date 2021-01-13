import { default as baseEachRight } from "./dist/78.js";
import { default as castFunction } from "./dist/108.js";
import { default as isArray } from "./isArray.js";
function arrayEachRight(array, iteratee) {
  var length = array == null ? 0 : array.length;

  while (length--) {
    if (iteratee(array[length], length, array) === false) {
      break;
    }
  }

  return array;
}
function forEachRight(collection, iteratee) {
  var func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, castFunction(iteratee));
}
export { forEachRight as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNzguanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAlcKsLi9pc0FycmF5LmpzCcLAgadkZWZhdWx0lKFsrGZvckVhY2hSaWdodBXA3AAXl6FvAAADwJILDsCZoWQJAALAkQLAwpihaa1iYXNlRWFjaFJpZ2h0kgISwACnZGVmYXVsdMDAmKFyCw3AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGNhc3RGdW5jdGlvbpIFE8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaadpc0FycmF5kggQwAKnZGVmYXVsdMDAmKFyCwfAwJEHwMKcoWkBFwcKkMDCAsLAwJehbwEACw2QwJmhZADMwAzAkQzAwpihbK5hcnJheUVhY2hSaWdodJIMEcDAwMDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlFYWNoUmlnaHQuanOYoXIJDsDAkQvAwpehbwEADhSQwJmhZAAOD8CVEBESEw/AwpihbKxmb3JFYWNoUmlnaHSSDxbAwMDA2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZm9yRWFjaFJpZ2h0LmpzmKFyCQzAEJEOwMKYoXImB8ARkQfAwpihcg8OwBKRC8DCmKFyAw3AE5EBwMKYoXIcDMDAkQTAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAMwMCRDsDC
====catalogjs annotation end====*/