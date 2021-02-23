import { default as copyArray } from "./117.js";
import { default as isIndex } from "./128.js";
import { default as composeArgs } from "./112.js";
import { default as composeArgsRight } from "./113.js";
import { default as createCtor } from "./100.js";
import { default as createRecurry } from "./33.js";
import { default as getHolder } from "./126.js";
import { default as replaceHolders } from "./129.js";
import { default as root } from "./93.js";
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }

  return result;
}
var nativeMin = Math.min;
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }

  return array;
}
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_ARY_FLAG = 128,
    WRAP_FLIP_FLAG = 512;
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG,
      isBind = bitmask & WRAP_BIND_FLAG,
      isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
      isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
      isFlip = bitmask & WRAP_FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }

    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }

    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }

    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }

    length -= holdersCount;

    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
    }

    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;
    length = args.length;

    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }

    if (isAry && ary < length) {
      args.length = ary;
    }

    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtor(fn);
    }

    return fn.apply(thisBinding, args);
  }

  return wrapper;
}
export { createHybrid as default };
/*====catalogjs annotation start====
k5mVwqguLzExNy5qcwPCwJXCqC4vMTI4LmpzB8LAlcKoLi8xMTIuanMLwsCVwqguLzExMy5qcw/CwJXCqC4vMTAwLmpzE8LAlcKnLi8zMy5qcxfCwJXCqC4vMTI2LmpzG8LAlcKoLi8xMjkuanMfwsCVwqcuLzkzLmpzI8LAgadkZWZhdWx0laFsrGNyZWF0ZUh5YnJpZFPAwNwAVZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqWNvcHlBcnJheZICL8AAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgKwMCQwMKZoWQJAAYIkQbAwpmhaadpc0luZGV4kgYwwAGnZGVmYXVsdMDAwJihcgsHwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCArAwJDAwpmhZAkACgyRCsDCmaFpq2NvbXBvc2VBcmdzkgpKwAKnZGVmYXVsdMDAwJihcgsLwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCArAwJDAwpmhZAkADhCRDsDCmaFpsGNvbXBvc2VBcmdzUmlnaHSSDkvAA6dkZWZhdWx0wMDAmKFyCxDAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcICsDAkMDCmaFkCQASFJESwMKZoWmqY3JlYXRlQ3RvcpMSR1HABKdkZWZhdWx0wMDAmKFyCwrAwJERwMKcoWkBAREXkRTAwgTCwMCYoWcICsDAkMDCmaFkCQAWGJEWwMKZoWmtY3JlYXRlUmVjdXJyeZIWTcAFp2RlZmF1bHTAwMCYoXILDcDAkRXAwpyhaQEBFRuRGMDCBcLAwJihZwgJwMCQwMKZoWQJABockRrAwpmhaalnZXRIb2xkZXKSGkjABqdkZWZhdWx0wMDAmKFyCwnAwJEZwMKcoWkBARkfkRzAwgbCwMCYoWcICsDAkMDCmaFkCQAeIJEewMKZoWmucmVwbGFjZUhvbGRlcnOSHkzAB6dkZWZhdWx0wMDAmKFyCw7AwJEdwMKcoWkBAR0jkSDAwgfCwMCYoWcICsDAkMDCmaFkCQAiJJEiwMKZoWmkcm9vdJIiUMAIp2RlZmF1bHTAwMCYoXILBMDAkSHAwpyhaQEBISWRJMDCCMLAwJihZwgJwMCQwMKXoW8BACYokMCZoWQAzLInwJEnwMKZoWysY291bnRIb2xkZXJzkidJwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY291bnRIb2xkZXJzLmpzmKFyCQzAwJEmwMKXoW8BACkxkMCYoWcAASoskMDCmaFkBAsrwJIrKcDCmaFsqW5hdGl2ZU1pbpIrLsDAwCmQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3Jlb3JkZXIuanOYoXIACcDAkSrAwpmhZAFILcCVLi8wLSrAwpmhbKdyZW9yZGVyki1PwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fcmVvcmRlci5qc5ihcgkHwC6RLMDCmKFyQgnAL5EqwMKYoXIuCcAwkQHAwpihclQHwMCRBcDCl6FvAQAyUpDAmKFnAAEzP5DAwpmhZAQENDWSNDLAwpmhbK5XUkFQX0JJTkRfRkxBR5I0QsDAwDKQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgAOwMCRM8DCmaFkBgQ2N5I2MsDCmaFssldSQVBfQklORF9LRVlfRkxBR5I2Q8DAwDKQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgASwMCRNcDCmaFkBgQ4OZI4MsDCmaFsr1dSQVBfQ1VSUllfRkxBR5I4RMDAwDKQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgAPwMCRN8DCmaFkBgU6O5I6MsDCmaFstVdSQVBfQ1VSUllfUklHSFRfRkxBR5I6RcDAwDKQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgAVwMCROcDCmaFkBgY8PZI8MsDCmaFsrVdSQVBfQVJZX0ZMQUeSPEHAwMAykNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVIeWJyaWQuanOYoXIADcDAkTvAwpmhZAYGPsCSPjLAwpmhbK5XUkFQX0ZMSVBfRkxBR5I+RsDAwDKQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgAOwMCRPcDCmaFkAU1AwNwAGEFCQ0RFRkdISUpLTE1PUFFATjszNTc5PcDCmaFsrGNyZWF0ZUh5YnJpZJNATlTAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVIeWJyaWQuanOYoXIJDMBBkT/AwpihcncNwEKRO8DCmKFyGw7AQ5EzwMKYoXIeEsBEkTXAwpihch8PwEWRN8DCmKFyAxXARpE5wMKYoXIcDsBHkT3AwpihcicKwEiREcDCmKFyzOoJwEmRGcDCmKFyJAzASpEmwMKYoXI9C8BLkQnAwpihclMQwEyRDcDCmKFyzJIOwE2RHcDCmKFyIg3ATpEVwMKYoXIQDMBPkT/AwpihcszzB8BQkSzAwpihcsyuBMBRkSHAwpihcjIKwMCREcDCmKFnAQNTwJDAwpihZwkLVMCRVMDCmKFyAAzAwJE/wMI=
====catalogjs annotation end====*/