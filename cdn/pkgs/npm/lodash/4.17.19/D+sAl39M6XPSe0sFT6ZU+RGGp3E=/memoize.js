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
k5GVwqwuL2Rpc3QvNjUuanMDwsCBp2RlZmF1bHSVoWynbWVtb2l6ZRLAwNwAFJehbwAAA8CRDsCZoWQJAAIEkQLAwpmhaahNYXBDYWNoZZMCDRDAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIDsDAkMDCl6FvAQAGEZDAmKFnAAEHCZDAwpmhZAQYCMCSCAbAwpmhbK9GVU5DX0VSUk9SX1RFWFSSCAvAwMAGkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21lbW9pemUuanOYoXIAD8DAkQfAwpmhZAEZCg6VCw0KDAfAwpmhbKdtZW1vaXpllAoMDxPAwMDAkQ7ZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tZW1vaXplLmpzmKFyCQfAC5EJwMKYoXLMgw/ADJEHwMKYoXLNAW8HwA2RCcDCmKFyCgjAwJEBwMKYoWcBAQ/Akg8QwMOYoXIAB8AQkQnAwpihcgkIwMCRAcDCmKFnAQMSwJDAwpihZwkLE8CRE8DCmKFyAAfAwJEJwMI=
====catalogjs annotation end====*/