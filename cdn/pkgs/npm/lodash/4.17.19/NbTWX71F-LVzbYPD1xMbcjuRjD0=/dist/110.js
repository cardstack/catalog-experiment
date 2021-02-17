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
k5GVwqguLzExMS5qcwPCwIGnZGVmYXVsdJWhbKhvdmVyUmVzdA/AwNwAEZehbwAAA8CQwJmhZAkAAgSRAsDCmaFppWFwcGx5kgINwACnZGVmYXVsdMDAwJihcgsFwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCArAwJDAwpehbwEABg6QwJihZwABBwmQwMKZoWQECwjAkggGwMKZoWypbmF0aXZlTWF4kwgLDMDAwAaQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX292ZXJSZXN0LmpzmKFyAAnAwJEHwMKZoWQBHwrAlQsMDQoHwMKZoWyob3ZlclJlc3SSChDAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19vdmVyUmVzdC5qc5ihcgkIwAuRCcDCmKFyJQnADJEHwMKYoXLMignADZEHwMKYoXLNAUAFwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAjAwJEJwMI=
====catalogjs annotation end====*/