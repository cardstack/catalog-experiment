import { default as isObject } from "./isObject.js";
import { default as now } from "./now.js";
import { default as toNumber } from "./toNumber.js";
var FUNC_ERROR_TEXT = 'Expected a function';
var nativeMax = Math.max,
    nativeMin = Math.min;
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  wait = toNumber(wait) || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
export { debounce as default };
/*====catalogjs annotation start====
k5OVwq0uL2lzT2JqZWN0LmpzA8LAlcKoLi9ub3cuanMGwsCVwq0uL3RvTnVtYmVyLmpzCcLAgadkZWZhdWx0lKFsqGRlYm91bmNlH8DcACGXoW8AAAPAkRPAmaFkCQACwJECwMKYoWmoaXNPYmplY3SSAhfAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmjbm93lAUbHB3AAadkZWZhdWx0wMCYoXILA8DAkQTAwpyhaQETBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmodG9OdW1iZXKTCBYZwAKnZGVmYXVsdMDAmKFyCwjAwJEHwMKcoWkBGAcKkMDCAsLAwJehbwEACx6QwJihZwABDA6QwMKZoWQEGA3Akg0LwMKYoWyvRlVOQ19FUlJPUl9URVhUkg0VwMDAC9lIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2RlYm91bmNlLmpzmKFyAA/AwJEMwMKYoWcBAQ8TkMDCmaFkBAsQEZIQDsDCmKFsqW5hdGl2ZU1heJIQGMDAwA7ZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kZWJvdW5jZS5qc5ihcgAJwMCRD8DCmaFkBgsSwJISDsDCmKFsqW5hdGl2ZU1pbpISGsDAwA7ZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kZWJvdW5jZS5qc5ihcgAJwMCREcDCmaFkAc0CPBTAnRUWFxgZGhscHRQMDxHAwpihbKhkZWJvdW5jZZIUIMDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kZWJvdW5jZS5qc5ihcgkIwBWRE8DCmKFyzQESD8AWkQzAwpihchEIwBeRB8DCmKFyFAjAGJEBwMKYoXJoCcAZkQ/AwpihcgEIwBqRB8DCmKFyzQKvCcAbkRHAwpihcs0BgAPAHJEEwMKYoXLNAk4DwB2RBMDCmKFyMgPAwJEEwMKYoWcBAx/AkMDCmKFnCQsgwJEgwMKYoXIACMDAkRPAwg==
====catalogjs annotation end====*/