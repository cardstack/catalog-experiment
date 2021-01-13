import { default as isPlainObject } from "./isPlainObject.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseClone } from "./dist/40.js";
import { default as baseUnset } from "./dist/10.js";
import { default as castPath } from "./dist/17.js";
import { default as copyObject } from "./dist/54.js";
import { default as flatRest } from "./dist/50.js";
import { default as getAllKeysIn } from "./dist/80.js";
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;
var omit = flatRest(function (object, paths) {
  var result = {};

  if (object == null) {
    return result;
  }

  var isDeep = false;
  paths = arrayMap(paths, function (path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);

  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }

  var length = paths.length;

  while (length--) {
    baseUnset(result, paths[length]);
  }

  return result;
});
export { omit as default };
/*====catalogjs annotation start====
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
====catalogjs annotation end====*/