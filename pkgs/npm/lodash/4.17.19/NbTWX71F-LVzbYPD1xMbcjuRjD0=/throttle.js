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
k5KVwq0uL2RlYm91bmNlLmpzA8LAlcKtLi9pc09iamVjdC5qcwbCwIGnZGVmYXVsdJShbKh0aHJvdHRsZRHA3AATl6FvAAADwJDAmaFkCQACwJECwMKYoWmoZGVib3VuY2WSAg/AAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoaXNPYmplY3SSBQ7AAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQYCsCSCgjAwpihbK9GVU5DX0VSUk9SX1RFWFSSCg3AwMAI2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGhyb3R0bGUuanOYoXIAD8DAkQnAwpmhZAFcDMCVDQ4PDAnAwpihbKh0aHJvdHRsZZIMEsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90aHJvdHRsZS5qc5ihcgkIwA2RC8DCmKFyzIEPwA6RCcDCmKFyDgjAD5EEwMKYoXLMowjAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACMDAkQvAwg==
====catalogjs annotation end====*/