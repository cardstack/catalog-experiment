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