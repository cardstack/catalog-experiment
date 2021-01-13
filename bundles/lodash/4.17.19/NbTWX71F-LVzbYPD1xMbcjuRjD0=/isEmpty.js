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
var hasOwnProperty = objectProto.hasOwnProperty;
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
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }

  return true;
}
export { isEmpty as default };
/*====catalogjs annotation start====
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
====catalogjs annotation end====*/