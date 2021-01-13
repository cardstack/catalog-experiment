import { default as MapCache } from "./dist/65.js";
var FUNC_ERROR_TEXT = 'Expected a function';
function memoize(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  var memoized = function () {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };

  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
memoize.Cache = MapCache;
export { memoize as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNjUuanMDwsCBp2RlZmF1bHSUoWynbWVtb2l6ZRHA3AATl6FvAAADwJIIDcCZoWQJAALAkQLAwpihaahNYXBDYWNoZZMCDA/AAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFEJDAmKFnAAEGCJDAwpmhZAQYB8CTBwUNwMKYoWyvRlVOQ19FUlJPUl9URVhUkgcKwMDABdlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21lbW9pemUuanOYoXIAD8DAkQbAwpmhZAEZCQ2WCgwJCwYNwMKYoWynbWVtb2l6ZZQJCw4SwMDAwNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21lbW9pemUuanOYoXIJB8AKkQjAwpihcsyDD8ALkQbAwpihcs0BbwfADJEIwMKYoXIKCMDAkQHAwpihZwEBDsCSDg/Aw5ihcgAHwA+RCMDCmKFyCQjAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAB8DAkQjAwg==
====catalogjs annotation end====*/