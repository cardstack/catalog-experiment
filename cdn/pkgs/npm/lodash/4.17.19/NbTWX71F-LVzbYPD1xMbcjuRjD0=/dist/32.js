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
k5mVwqguLzExNy5qcwPCwJXCqC4vMTI4LmpzBsLAlcKoLi8xMTIuanMJwsCVwqguLzExMy5qcwzCwJXCqC4vMTAwLmpzD8LAlcKnLi8zMy5qcxLCwJXCqC4vMTI2LmpzFcLAlcKoLi8xMjkuanMYwsCVwqcuLzkzLmpzG8LAgadkZWZhdWx0laFsrGNyZWF0ZUh5YnJpZErAwNwATJehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqWNvcHlBcnJheZICJsAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQATAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmnaXNJbmRleJIFJ8ABp2RlZmF1bHTAwMCYoXILB8DAkQTAwpyhaQETBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmrY29tcG9zZUFyZ3OSCEHAAqdkZWZhdWx0wMDAmKFyCwvAwJEHwMKcoWkBEwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpsGNvbXBvc2VBcmdzUmlnaHSSC0LAA6dkZWZhdWx0wMDAmKFyCxDAwJEKwMKcoWkBEwoPkMDCA8LAwJmhZAkADsCRDsDCmaFpqmNyZWF0ZUN0b3KTDj5IwASnZGVmYXVsdMDAwJihcgsKwMCRDcDCnKFpARMNEpDAwgTCwMCZoWQJABHAkRHAwpmhaa1jcmVhdGVSZWN1cnJ5khFEwAWnZGVmYXVsdMDAwJihcgsNwMCREMDCnKFpARIQFZDAwgXCwMCZoWQJABTAkRTAwpmhaalnZXRIb2xkZXKSFD/ABqdkZWZhdWx0wMDAmKFyCwnAwJETwMKcoWkBExMYkMDCBsLAwJmhZAkAF8CRF8DCmaFprnJlcGxhY2VIb2xkZXJzkhdDwAenZGVmYXVsdMDAwJihcgsOwMCRFsDCnKFpARMWG5DAwgfCwMCZoWQJABrAkRrAwpmhaaRyb290khpHwAinZGVmYXVsdMDAwJihcgsEwMCRGcDCnKFpARIZHJDAwgjCwMCXoW8BAB0fkMCZoWQAzLIewJEewMKZoWysY291bnRIb2xkZXJzkh5AwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY291bnRIb2xkZXJzLmpzmKFyCQzAwJEdwMKXoW8BACAokMCYoWcAASEjkMDCmaFkBAsiwJIiIMDCmaFsqW5hdGl2ZU1pbpIiJcDAwCCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3Jlb3JkZXIuanOYoXIACcDAkSHAwpmhZAFIJMCVJSYnJCHAwpmhbKdyZW9yZGVykiRGwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fcmVvcmRlci5qc5ihcgkHwCWRI8DCmKFyQgnAJpEhwMKYoXIuCcAnkQHAwpihclQHwMCRBMDCl6FvAQApSZDAmKFnAAEqNpDAwpmhZAQEKyySKynAwpmhbK5XUkFQX0JJTkRfRkxBR5IrOcDAwCmQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgAOwMCRKsDCmaFkBgQtLpItKcDCmaFssldSQVBfQklORF9LRVlfRkxBR5ItOsDAwCmQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgASwMCRLMDCmaFkBgQvMJIvKcDCmaFsr1dSQVBfQ1VSUllfRkxBR5IvO8DAwCmQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgAPwMCRLsDCmaFkBgUxMpIxKcDCmaFstVdSQVBfQ1VSUllfUklHSFRfRkxBR5IxPMDAwCmQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgAVwMCRMMDCmaFkBgYzNJIzKcDCmaFsrVdSQVBfQVJZX0ZMQUeSMzjAwMApkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVIeWJyaWQuanOYoXIADcDAkTLAwpmhZAYGNcCSNSnAwpmhbK5XUkFQX0ZMSVBfRkxBR5I1PcDAwCmQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUh5YnJpZC5qc5ihcgAOwMCRNMDCmaFkAU03wNwAGDg5Ojs8PT4/QEFCQ0RGR0g3RTIqLC4wNMDCmaFsrGNyZWF0ZUh5YnJpZJM3RUvAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVIeWJyaWQuanOYoXIJDMA4kTbAwpihcncNwDmRMsDCmKFyGw7AOpEqwMKYoXIeEsA7kSzAwpihch8PwDyRLsDCmKFyAxXAPZEwwMKYoXIcDsA+kTTAwpihcicKwD+RDcDCmKFyzOoJwECRE8DCmKFyJAzAQZEdwMKYoXI9C8BCkQfAwpihclMQwEORCsDCmKFyzJIOwESRFsDCmKFyIg3ARZEQwMKYoXIQDMBGkTbAwpihcszzB8BHkSPAwpihcsyuBMBIkRnAwpihcjIKwMCRDcDCmKFnAQNKwJDAwpihZwkLS8CRS8DCmKFyAAzAwJE2wMI=
====catalogjs annotation end====*/