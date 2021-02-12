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
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dE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVQYXJ0aWFsLmpzmKFyAA/AwJFAwMKZoWQBPUPAlkRFRkdDQMDCmaFsrWNyZWF0ZVBhcnRpYWySQ8ygwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUGFydGlhbC5qc5ihcgkNwESRQsDCmKFyPg/ARZFAwMKYoXIPCsBGkQHAwpihcszqBMBHkQTAwpihcszmBcDAkQfAwpehbwEASXOQwJihZwABSkyQwMKZoWQEG0vAkktJwMKZoWyrUExBQ0VIT0xERVKTS21wwMDASZDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWVyZ2VEYXRhLmpzmKFyAAvAwJFKwMKYoWcBAU1ZkMDCmaFkBAROT5JOTMDCmaFsr1dSQVBfQklORF9GTEFHMJROXmhpwMDATJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWVyZ2VEYXRhLmpzmKFyAA/AwJFNwMKZoWQGBFBRklBMwMKZoWyzV1JBUF9CSU5EX0tFWV9GTEFHMJJQX8DAwEyQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX21lcmdlRGF0YS5qc5ihcgATwMCRT8DCmaFkBgRSU5JSTMDCmaFstVdSQVBfQ1VSUllfQk9VTkRfRkxBR5JSasDAwEyQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX21lcmdlRGF0YS5qc5ihcgAVwMCRUcDCmaFkBgRUVZJUTMDCmaFssFdSQVBfQ1VSUllfRkxBRzCTVGJnwMDATJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWVyZ2VEYXRhLmpzmKFyABDAwJFTwMKZoWQGBlZXklZMwMKZoWytV1JBUF9BUllfRkxBR5ZWYGFjZXHAwMBMkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19tZXJnZURhdGEuanOYoXIADcDAkVXAwpmhZAYGWMCSWEzAwpmhbK9XUkFQX1JFQVJHX0ZMQUeTWGRmwMDATJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWVyZ2VEYXRhLmpzmKFyAA/AwJFXwMKYoWcBAVpckMDCmaFkBAtbwJJbWcDCmaFsqW5hdGl2ZU1pbpJbcsDAwFmQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX21lcmdlRGF0YS5qc5ihcgAJwMCRWsDCmaFkAcyRXcDcAB5eX2BhYmNkZWZnaGlqa2xtbm9wcXJdTU9VU1dRSlrAwpmhbKltZXJnZURhdGGSXcySwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWVyZ2VEYXRhLmpzmKFyCQnAXpFcwMKYoXLMkA/AX5FNwMKYoXIDE8BgkU/AwpihcgMNwGGRVcDCmKFyIQ3AYpFVwMKYoXIPEMBjkVPAwpihchINwGSRVcDCmKFyDw/AZZFXwMKYoXIyDcBmkVXAwpihcgMPwGeRV8DCmKFyMRDAaJFTwMKYoXJMD8BpkU3AwpihcjkPwGqRTcDCmKFyBxXAa5FRwMKYoXJlC8BskRbAwpihcj8OwG2RE8DCmKFyCgvAbpFKwMKYoXJqEMBvkRnAwpihcj8OwHCRE8DCmKFyCgvAcZFKwMKYoXJmDcBykVXAwpihcjAJwMCRWsDCl6FvAQB0zKWQwJihZwABdXeQwMKZoWQEGHbAknZ0wMKZoWyvRlVOQ19FUlJPUl9URVhUknbMisDAwHSQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVdyYXAuanOYoXIAD8DAkXXAwpihZwEBeMyEkMDCmaFkBAR5epJ5d8DCmaFsrldSQVBfQklORF9GTEFHk3nMmMyewMDAd5DZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlV3JhcC5qc5ihcgAOwMCReMDCmaFkBgR7fJJ7d8DCmaFssldSQVBfQklORF9LRVlfRkxBR5J7zInAwMB3kNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyABLAwJF6wMKZoWQGBH1+kn13wMKZoWyvV1JBUF9DVVJSWV9GTEFHlH3MlMyWzJrAwMB3kNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyAA/AwJF8wMKZoWQGBX/MgJJ/d8DCmaFstVdSQVBfQ1VSUllfUklHSFRfRkxBR5R/zJXMl8ybwMDAd5DZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlV3JhcC5qc5ihcgAVwMCRfsDCmaFkBgXMgcyCksyBd8DCmaFssVdSQVBfUEFSVElBTF9GTEFHlMyBzIvMncyfwMDAd5DZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlV3JhcC5qc5ihcgARwMCRzIDAwpmhZAYFzIPAksyDd8DCmaFst1dSQVBfUEFSVElBTF9SSUdIVF9GTEFHk8yDzIzMkMDAwHeQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVdyYXAuanOYoXIAF8DAkcyCwMKYoWcBAcyFzIeQwMKZoWQEC8yGwJLMhsyEwMKZoWypbmF0aXZlTWF4k8yGzI3Mk8DAwMyEkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyAAnAwJHMhcDCmaFkASvMiMDcACXMicyKzIvMjMyNzI7Mj8yQzJHMksyTzJTMlcyWzJfMmMyZzJrMm8yczJ3MnsyfzKDMocyizKPMpMyIenXMgMyCzIV8fnjAwpmhbKpjcmVhdGVXcmFwksyIzKfAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVXcmFwLmpzmKFyCQrAzImRzIfAwpihcl4SwMyKkXrAwpihckwPwMyLkXXAwpihcloRwMyMkcyAwMKYoXIDF8DMjZHMgsDCmKFyTgnAzI6RzIXAwpihcgEJwMyPkSjAwpihcjMJwMyQkSjAwpihckQXwMyRkcyCwMKYoXLMlAfAzJKRH8DCmKFyzIkJwMyTkVzAwpihcszcCcDMlJHMhcDCmKFyNg/AzJWRfMDCmKFyAxXAzJaRfsDCmKFyFg/AzJeRfMDCmKFyAxXAzJiRfsDCmKFyJQ7AzJmReMDCmKFyFQrAzJqRL8DCmKFyMg/AzJuRfMDCmKFyDxXAzJyRfsDCmKFyEQvAzJ2RNcDCmKFyMRHAzJ6RzIDAwpihchAOwMyfkXjAwpihcgMRwMygkcyAwMKYoXImDcDMoZFCwMKYoXI8DMDMopEKwMKYoXI3C8DMo5EcwMKYoXIDB8DMpJEiwMKYoXILD8DAkSXAwpihZwEDzKbAkMDCmKFnCQvMp8CRzKfAwpihcgAKwMCRzIfAwg==
====catalogjs annotation end====*/