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