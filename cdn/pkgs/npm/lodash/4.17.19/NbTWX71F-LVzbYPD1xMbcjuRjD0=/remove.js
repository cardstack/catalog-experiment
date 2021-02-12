import { default as baseIteratee } from "./dist/6.js";
import { default as basePullAt } from "./dist/9.js";
function remove(array, predicate) {
  var result = [];

  if (!(array && array.length)) {
    return result;
  }

  var index = -1,
      indexes = [],
      length = array.length;
  predicate = baseIteratee(predicate, 3);

  while (++index < length) {
    var value = array[index];

    if (predicate(value, index, array)) {
      result.push(value);
      indexes.push(index);
    }
  }

  basePullAt(array, indexes);
  return result;
}
export { remove as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCqy4vZGlzdC85LmpzBsLAgadkZWZhdWx0laFspnJlbW92ZQ3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaaxiYXNlSXRlcmF0ZWWSAgrAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqmJhc2VQdWxsQXSSBQvAAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACAyQwJmhZAAkCcCTCgsJwMKZoWymcmVtb3ZlkgkOwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZW1vdmUuanOYoXIJBsAKkQjAwpihcsy0DMALkQHAwpihcsy5CsDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAGwMCRCMDC
====catalogjs annotation end====*/