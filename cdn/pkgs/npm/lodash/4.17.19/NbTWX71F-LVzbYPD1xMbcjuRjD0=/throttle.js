import { default as debounce } from "./debounce.js";
import { default as isObject } from "./isObject.js";
var FUNC_ERROR_TEXT = 'Expected a function';
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}
export { throttle as default };
/*====catalogjs annotation start====
k5KVwq0uL2RlYm91bmNlLmpzA8LAlcKtLi9pc09iamVjdC5qcwbCwIGnZGVmYXVsdJWhbKh0aHJvdHRsZRHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqGRlYm91bmNlkgIPwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahpc09iamVjdJIFDsABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQYCsCSCgjAwpmhbK9GVU5DX0VSUk9SX1RFWFSSCg3AwMAIkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Rocm90dGxlLmpzmKFyAA/AwJEJwMKZoWQBXAzAlQ0ODwwJwMKZoWyodGhyb3R0bGWSDBLAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Rocm90dGxlLmpzmKFyCQjADZELwMKYoXLMgQ/ADpEJwMKYoXIOCMAPkQTAwpihcsyjCMDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAIwMCRC8DC
====catalogjs annotation end====*/