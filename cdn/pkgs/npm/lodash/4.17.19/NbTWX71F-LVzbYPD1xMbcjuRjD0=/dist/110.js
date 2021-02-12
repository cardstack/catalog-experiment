import { default as apply } from "./111.js";
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }

    index = -1;
    var otherArgs = Array(start + 1);

    while (++index < start) {
      otherArgs[index] = args[index];
    }

    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}
export { overRest as default };
/*====catalogjs annotation start====
k5GVwqguLzExMS5qcwPCwIGnZGVmYXVsdJWhbKhvdmVyUmVzdA7AwNwAEJehbwAAA8CQwJmhZAkAAsCRAsDCmaFppWFwcGx5kgIMwACnZGVmYXVsdMDAwJihcgsFwMCRAcDCnKFpABMBBJDAwgDCwMCXoW8BAAUNkMCYoWcAAQYIkMDCmaFkBAsHwJIHBcDCmaFsqW5hdGl2ZU1heJMHCgvAwMAFkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19vdmVyUmVzdC5qc5ihcgAJwMCRBsDCmaFkAR8JwJUKCwwJBsDCmaFsqG92ZXJSZXN0kgkPwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fb3ZlclJlc3QuanOYoXIJCMAKkQjAwpihciUJwAuRBsDCmKFyzIoJwAyRBsDCmKFyzQFABcDAkQHAwpihZwEDDsCQwMKYoWcJCw/AkQ/AwpihcgAIwMCRCMDC
====catalogjs annotation end====*/