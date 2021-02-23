import { default as baseAssignValue } from "./56.js";
import { default as eq } from "../eq.js";
import { default as cloneBuffer } from "./89.js";
import { default as cloneTypedArray } from "./90.js";
import { default as copyArray } from "./117.js";
import { default as initCloneObject } from "./105.js";
import { default as isArguments } from "../isArguments.js";
import { default as isArray } from "../isArray.js";
import { default as isArrayLikeObject } from "../isArrayLikeObject.js";
import { default as isBuffer } from "../isBuffer.js";
import { default as isFunction } from "../isFunction.js";
import { default as isObject } from "../isObject.js";
import { default as isPlainObject } from "../isPlainObject.js";
import { default as isTypedArray } from "../isTypedArray.js";
import { default as toPlainObject } from "../toPlainObject.js";
import { default as Stack } from "./59.js";
import { default as baseFor } from "./158.js";
import { default as keysIn } from "../keysIn.js";
function assignMergeValue(object, key, value) {
  if (value !== undefined && !eq(object[key], value) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }

  var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;
  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;

    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;

      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }

  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }

  assignMergeValue(object, key, newValue);
}
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }

  baseFor(source, function (srcValue, key) {
    stack || (stack = new Stack());

    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + '', object, source, stack) : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }

      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}
export { baseMerge as default };
/*====catalogjs annotation start====
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
====catalogjs annotation end====*/