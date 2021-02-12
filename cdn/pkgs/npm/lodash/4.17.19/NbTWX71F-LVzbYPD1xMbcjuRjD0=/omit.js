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