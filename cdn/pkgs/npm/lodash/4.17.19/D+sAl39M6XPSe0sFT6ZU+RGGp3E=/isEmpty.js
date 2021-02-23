import { default as baseKeys } from "./dist/132.js";
import { default as getTag } from "./dist/45.js";
import { default as isArguments } from "./isArguments.js";
import { default as isArray } from "./isArray.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isBuffer } from "./isBuffer.js";
import { default as isPrototype } from "./dist/133.js";
import { default as isTypedArray } from "./isTypedArray.js";
var mapTag = '[object Map]',
    setTag = '[object Set]';
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }

  if (isArrayLike(value) && (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }

  var tag = getTag(value);

  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }

  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }

  for (var key in value) {
    if (hasOwnProperty0.call(value, key)) {
      return false;
    }
  }

  return true;
}
export { isEmpty as default };
/*====catalogjs annotation start====
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
====catalogjs annotation end====*/