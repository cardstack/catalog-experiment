import { default as createCtor } from "./100.js";
import { default as root } from "./93.js";
import { default as apply } from "./111.js";
import { default as createHybrid } from "./32.js";
import { default as createRecurry } from "./33.js";
import { default as getHolder } from "./126.js";
import { default as replaceHolders } from "./129.js";
import { default as composeArgs } from "./112.js";
import { default as composeArgsRight } from "./113.js";
import { default as baseSetData } from "./35.js";
import { default as getData } from "./38.js";
import { default as setData } from "./34.js";
import { default as setWrapToString } from "./47.js";
import { default as toInteger } from "../toInteger.js";
var WRAP_BIND_FLAG2 = 1;
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG2,
      Ctor = createCtor(func);

  function wrapper() {
    var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }

  return wrapper;
}
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }

    var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
    length -= holders.length;

    if (length < arity) {
      return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined, args, holders, undefined, undefined, arity - length);
    }

    var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
    return apply(fn, this, args);
  }

  return wrapper;
}
var WRAP_BIND_FLAG1 = 1;
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG1,
      Ctor = createCtor(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = this && this !== root && this instanceof wrapper ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }

    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }

    return apply(fn, isBind ? thisArg : this, args);
  }

  return wrapper;
}
var PLACEHOLDER = '__lodash_placeholder__';
var WRAP_BIND_FLAG0 = 1,
    WRAP_BIND_KEY_FLAG0 = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG0 = 8,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256;
var nativeMin = Math.min;
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (WRAP_BIND_FLAG0 | WRAP_BIND_KEY_FLAG0 | WRAP_ARY_FLAG);
  var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG0 || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG0;

  if (!(isCommon || isCombo)) {
    return data;
  }

  if (srcBitmask & WRAP_BIND_FLAG0) {
    data[2] = source[2];
    newBitmask |= bitmask & WRAP_BIND_FLAG0 ? 0 : WRAP_CURRY_BOUND_FLAG;
  }

  var value = source[3];

  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
  }

  value = source[5];

  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
  }

  value = source[7];

  if (value) {
    data[7] = value;
  }

  if (srcBitmask & WRAP_ARY_FLAG) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }

  if (data[9] == null) {
    data[9] = source[9];
  }

  data[0] = source[0];
  data[1] = newBitmask;
  return data;
}
var FUNC_ERROR_TEXT = 'Expected a function';
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64;
var nativeMax = Math.max;
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;

  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  var length = partials ? partials.length : 0;

  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }

  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;
    partials = holders = undefined;
  }

  var data = isBindKey ? undefined : getData(func);
  var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

  if (data) {
    mergeData(newData, data);
  }

  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === undefined ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
    bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
  }

  if (!bitmask || bitmask == WRAP_BIND_FLAG) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(undefined, newData);
  }

  var setter = data ? baseSetData : setData;
  return setWrapToString(setter(result, newData), func, bitmask);
}
export { createWrap as default };
/*====catalogjs annotation start====
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wMKYoXLMsg7ASJEZwMKYoXJbDcBJkRHAwpihchAMwEqRDcDCmKFyfQTAS5EFwMKYoXI2BcDAkQnAwpehbwEATVaQwJihZwABTlCQwMKZoWQEBE/Akk9NwMKZoWyvV1JBUF9CSU5EX0ZMQUcxkk9SwMDATZDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUGFydGlhbC5qc5ihcgAPwMCRTsDCmaFkAT1RwJZSU1RVUU7AwpmhbK1jcmVhdGVQYXJ0aWFsklHMrsDAwMCQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVBhcnRpYWwuanOYoXIJDcBSkVDAwpihcj4PwFORTsDCmKFyDwrAVJEBwMKYoXLM6gTAVZEFwMKYoXLM5gXAwJEJwMKXoW8BAFfMgZDAmKFnAAFYWpDAwpmhZAQbWcCSWVfAwpmhbKtQTEFDRUhPTERFUpNZe37AwMBXkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19tZXJnZURhdGEuanOYoXIAC8DAkVjAwpihZwEBW2eQwMKZoWQEBFxdklxawMKZoWyvV1JBUF9CSU5EX0ZMQUcwlFxsdnfAwMBakNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19tZXJnZURhdGEuanOYoXIAD8DAkVvAwpmhZAYEXl+SXlrAwpmhbLNXUkFQX0JJTkRfS0VZX0ZMQUcwkl5twMDAWpDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWVyZ2VEYXRhLmpzmKFyABPAwJFdwMKZoWQGBGBhkmBawMKZoWy1V1JBUF9DVVJSWV9CT1VORF9GTEFHkmB4wMDAWpDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWVyZ2VEYXRhLmpzmKFyABXAwJFfwMKZoWQGBGJjkmJawMKZoWywV1JBUF9DVVJSWV9GTEFHMJNicHXAwMBakNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19tZXJnZURhdGEuanOYoXIAEMDAkWHAwpmhZAYGZGWSZFrAwpmhbK1XUkFQX0FSWV9GTEFHlmRub3Fzf8DAwFqQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX21lcmdlRGF0YS5qc5ihcgANwMCRY8DCmaFkBgZmwJJmWsDCmaFsr1dSQVBfUkVBUkdfRkxBR5NmcnTAwMBakNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19tZXJnZURhdGEuanOYoXIAD8DAkWXAwpihZwEBaGqQwMKZoWQEC2nAkmlnwMKZoWypbmF0aXZlTWlukmnMgMDAwGeQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX21lcmdlRGF0YS5qc5ihcgAJwMCRaMDCmaFkAcyRa8DcAB5sbW5vcHFyc3R1dnd4eXp7fH1+f8yAa1tdY2FlX1howMKZoWypbWVyZ2VEYXRhkmvMoMDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX21lcmdlRGF0YS5qc5ihcgkJwGyRasDCmKFyzJAPwG2RW8DCmKFyAxPAbpFdwMKYoXIDDcBvkWPAwpihciENwHCRY8DCmKFyDxDAcZFhwMKYoXISDcBykWPAwpihcg8PwHORZcDCmKFyMg3AdJFjwMKYoXIDD8B1kWXAwpihcjEQwHaRYcDCmKFyTA/Ad5FbwMKYoXI5D8B4kVvAwpihcgcVwHmRX8DCmKFyZQvAepEdwMKYoXI/DsB7kRnAwpihcgoLwHyRWMDCmKFyahDAfZEhwMKYoXI/DsB+kRnAwpihcgoLwH+RWMDCmKFyZg3AzICRY8DCmKFyMAnAwJFowMKXoW8BAMyCzLOQwJihZwABzIPMhZDAwpmhZAQYzITAksyEzILAwpmhbK9GVU5DX0VSUk9SX1RFWFSSzITMmMDAwMyCkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyAA/AwJHMg8DCmKFnAQHMhsySkMDCmaFkBATMh8yIksyHzIXAwpmhbK5XUkFQX0JJTkRfRkxBR5PMh8ymzKzAwMDMhZDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlV3JhcC5qc5ihcgAOwMCRzIbAwpmhZAYEzInMipLMicyFwMKZoWyyV1JBUF9CSU5EX0tFWV9GTEFHksyJzJfAwMDMhZDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlV3JhcC5qc5ihcgASwMCRzIjAwpmhZAYEzIvMjJLMi8yFwMKZoWyvV1JBUF9DVVJSWV9GTEFHlMyLzKLMpMyowMDAzIWQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVdyYXAuanOYoXIAD8DAkcyKwMKZoWQGBcyNzI6SzI3MhcDCmaFstVdSQVBfQ1VSUllfUklHSFRfRkxBR5TMjcyjzKXMqcDAwMyFkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyABXAwJHMjMDCmaFkBgXMj8yQksyPzIXAwpmhbLFXUkFQX1BBUlRJQUxfRkxBR5TMj8yZzKvMrcDAwMyFkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyABHAwJHMjsDCmaFkBgXMkcCSzJHMhcDCmaFst1dSQVBfUEFSVElBTF9SSUdIVF9GTEFHk8yRzJrMnsDAwMyFkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyABfAwJHMkMDCmKFnAQHMk8yVkMDCmaFkBAvMlMCSzJTMksDCmaFsqW5hdGl2ZU1heJPMlMybzKHAwMDMkpDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlV3JhcC5qc5ihcgAJwMCRzJPAwpmhZAErzJbA3AAlzJfMmMyZzJrMm8yczJ3MnsyfzKDMocyizKPMpMylzKbMp8yozKnMqsyrzKzMrcyuzK/MsMyxzLLMlsyIzIPMjsyQzJPMisyMzIbAwpmhbKpjcmVhdGVXcmFwksyWzLXAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyCQrAzJeRzJXAwpihcl4SwMyYkcyIwMKYoXJMD8DMmZHMg8DCmKFyWhHAzJqRzI7AwpihcgMXwMybkcyQwMKYoXJOCcDMnJHMk8DCmKFyAQnAzJ2RNcDCmKFyMwnAzJ6RNcDCmKFyRBfAzJ+RzJDAwpihcsyUB8DMoJEpwMKYoXLMiQnAzKGRasDCmKFyzNwJwMyikcyTwMKYoXI2D8DMo5HMisDCmKFyAxXAzKSRzIzAwpihchYPwMylkcyKwMKYoXIDFcDMppHMjMDCmKFyJQ7AzKeRzIbAwpihchUKwMyokT3AwpihcjIPwMypkcyKwMKYoXIPFcDMqpHMjMDCmKFyEQvAzKuRQ8DCmKFyMRHAzKyRzI7AwpihchAOwMytkcyGwMKYoXIDEcDMrpHMjsDCmKFyJg3AzK+RUMDCmKFyPAzAzLCRDcDCmKFyNwvAzLGRJcDCmKFyAwfAzLKRLcDCmKFyCw/AwJExwMKYoWcBA8y0wJDAwpihZwkLzLXAkcy1wMKYoXIACsDAkcyVwMI=
====catalogjs annotation end====*/