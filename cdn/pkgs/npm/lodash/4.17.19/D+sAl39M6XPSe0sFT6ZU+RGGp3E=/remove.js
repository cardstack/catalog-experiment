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
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCqy4vZGlzdC85LmpzB8LAgadkZWZhdWx0laFspnJlbW92ZQ/AwNwAEZehbwAAA8CQwJmhZAkAAgSRAsDCmaFprGJhc2VJdGVyYXRlZZICDMAAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgNwMCQwMKZoWQJAAYIkQbAwpmhaapiYXNlUHVsbEF0kgYNwAGnZGVmYXVsdMDAwJihcgsKwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA3AwJDAwpehbwEACg6QwJmhZAAkC8CTDA0LwMKZoWymcmVtb3ZlkgsQwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZW1vdmUuanOYoXIJBsAMkQrAwpihcsy0DMANkQHAwpihcsy5CsDAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAGwMCRCsDC
====catalogjs annotation end====*/