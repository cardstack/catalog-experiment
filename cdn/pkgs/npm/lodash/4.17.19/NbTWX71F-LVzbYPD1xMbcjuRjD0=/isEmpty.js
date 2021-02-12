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