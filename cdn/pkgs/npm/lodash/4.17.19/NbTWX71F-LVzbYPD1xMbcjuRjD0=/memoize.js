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
k5GVwqwuL2Rpc3QvNjUuanMDwsCBp2RlZmF1bHSVoWynbWVtb2l6ZRHAwNwAE5ehbwAAA8CRDcCZoWQJAALAkQLAwpmhaahNYXBDYWNoZZMCDA/AAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABRCQwJihZwABBgiQwMKZoWQEGAfAkgcFwMKZoWyvRlVOQ19FUlJPUl9URVhUkgcKwMDABZDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tZW1vaXplLmpzmKFyAA/AwJEGwMKZoWQBGQkNlQoMCQsGwMKZoWynbWVtb2l6ZZQJCw4SwMDAwJEN2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWVtb2l6ZS5qc5ihcgkHwAqRCMDCmKFyzIMPwAuRBsDCmKFyzQFvB8AMkQjAwpihcgoIwMCRAcDCmKFnAQEOwJIOD8DDmKFyAAfAD5EIwMKYoXIJCMDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAHwMCRCMDC
====catalogjs annotation end====*/