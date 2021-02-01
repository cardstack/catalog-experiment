import { default as castPath } from "./dist/17.js";
import { default as isFunction } from "./isFunction.js";
import { default as toKey } from "./dist/27.js";
function result(object, path, defaultValue) {
  path = castPath(path, object);
  var index = -1,
      length = path.length;

  if (!length) {
    length = 1;
    object = undefined;
  }

  while (++index < length) {
    var value = object == null ? undefined : object[toKey(path[index])];

    if (value === undefined) {
      index = length;
      value = defaultValue;
    }

    object = isFunction(value) ? value.call(object) : value;
  }

  return object;
}
export { result as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMTcuanMDwsCVwq8uL2lzRnVuY3Rpb24uanMGwsCVwqwuL2Rpc3QvMjcuanMJwsCBp2RlZmF1bHSUoWymcmVzdWx0EcDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpihaahjYXN0UGF0aJICDcAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaappc0Z1bmN0aW9ukgUPwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBGgQJkMDCAcLAwJmhZAkACMCRCMDCmKFppXRvS2V5kggOwAKnZGVmYXVsdMDAmKFyCwXAwJEHwMKcoWkBFwcKkMDCAsLAwJehbwEACxCQwJmhZAA9DMCUDQ4PDMDCmKFspnJlc3VsdJIMEsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZXN1bHQuanOYoXIJBsANkQvAwpihcigIwA6RAcDCmKFyzM4FwA+RB8DCmKFydgrAwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABsDAkQvAwg==
====catalogjs annotation end====*/