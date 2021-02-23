import { default as isLaziable } from "./37.js";
import { default as setData } from "./34.js";
import { default as setWrapToString } from "./47.js";
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG = 8,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64;
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;
  bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
    bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
  }

  var newData = [func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary, arity];
  var result = wrapFunc.apply(undefined, newData);

  if (isLaziable(func)) {
    setData(result, newData);
  }

  result.placeholder = placeholder;
  return setWrapToString(result, func, bitmask);
}
export { createRecurry as default };
/*====catalogjs annotation start====
k5OVwqcuLzM3LmpzA8LAlcKnLi8zNC5qcwfCwJXCpy4vNDcuanMLwsCBp2RlZmF1bHSVoWytY3JlYXRlUmVjdXJyeSnAwNwAK5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqmlzTGF6aWFibGWSAiXAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmnc2V0RGF0YZIGJsABp2RlZmF1bHTAwMCYoXILB8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgJwMCQwMKZoWQJAAoMkQrAwpmhaa9zZXRXcmFwVG9TdHJpbmeSCifAAqdkZWZhdWx0wMDAmKFyCw/AwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcICcDAkMDCl6FvAQAOKJDAmKFnAAEPG5DAwpmhZAQEEBGSEA7AwpmhbK5XUkFQX0JJTkRfRkxBR5IQI8DAwA6Q2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVJlY3VycnkuanOYoXIADsDAkQ/AwpmhZAYEEhOSEg7AwpmhbLJXUkFQX0JJTkRfS0VZX0ZMQUeSEiTAwMAOkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSZWN1cnJ5LmpzmKFyABLAwJERwMKZoWQGBBQVkhQOwMKZoWy1V1JBUF9DVVJSWV9CT1VORF9GTEFHkhQiwMDADpDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUmVjdXJyeS5qc5ihcgAVwMCRE8DCmaFkBgQWF5IWDsDCmaFsr1dSQVBfQ1VSUllfRkxBR5IWHcDAwA6Q2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVJlY3VycnkuanOYoXIAD8DAkRXAwpmhZAYFGBmSGA7AwpmhbLFXUkFQX1BBUlRJQUxfRkxBR5MYHiHAwMAOkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSZWN1cnJ5LmpzmKFyABHAwJEXwMKZoWQGBRrAkhoOwMKZoWy3V1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUeTGh8gwMDADpDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUmVjdXJyeS5qc5ihcgAXwMCRGcDCmaFkARocwNwAEh0eHyAhIiMkJSYnHBUXGRMPEcDCmaFsrWNyZWF0ZVJlY3VycnmSHCrAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSZWN1cnJ5LmpzmKFyCQ3AHZEbwMKYoXJzD8AekRXAwpihcszvEcAfkRfAwpihcgMXwCCRGcDCmKFyGxfAIZEZwMKYoXIDEcAikRfAwpihchYVwCORE8DCmKFyFg7AJJEPwMKYoXIDEsAlkRHAwpihcsy8CsAmkQHAwpihcg4HwCeRBcDCmKFyRQ/AwJEJwMKYoWcBAynAkMDCmKFnCQsqwJEqwMKYoXIADcDAkRvAwg==
====catalogjs annotation end====*/