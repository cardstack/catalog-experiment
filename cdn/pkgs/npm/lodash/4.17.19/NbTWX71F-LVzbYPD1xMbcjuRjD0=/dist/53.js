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