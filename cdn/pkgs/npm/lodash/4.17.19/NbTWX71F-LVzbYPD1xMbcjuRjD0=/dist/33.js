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
k5OVwqcuLzM3LmpzA8LAlcKnLi8zNC5qcwbCwJXCpy4vNDcuanMJwsCBp2RlZmF1bHSVoWytY3JlYXRlUmVjdXJyeSbAwNwAKJehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmlzTGF6aWFibGWSAiLAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpp3NldERhdGGSBSPAAadkZWZhdWx0wMDAmKFyCwfAwJEEwMKcoWkBEgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpr3NldFdyYXBUb1N0cmluZ5IIJMACp2RlZmF1bHTAwMCYoXILD8DAkQfAwpyhaQESBwqQwMICwsDAl6FvAQALJZDAmKFnAAEMGJDAwpmhZAQEDQ6SDQvAwpmhbK5XUkFQX0JJTkRfRkxBR5INIMDAwAuQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVJlY3VycnkuanOYoXIADsDAkQzAwpmhZAYEDxCSDwvAwpmhbLJXUkFQX0JJTkRfS0VZX0ZMQUeSDyHAwMALkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSZWN1cnJ5LmpzmKFyABLAwJEOwMKZoWQGBBESkhELwMKZoWy1V1JBUF9DVVJSWV9CT1VORF9GTEFHkhEfwMDAC5DZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUmVjdXJyeS5qc5ihcgAVwMCREMDCmaFkBgQTFJITC8DCmaFsr1dSQVBfQ1VSUllfRkxBR5ITGsDAwAuQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVJlY3VycnkuanOYoXIAD8DAkRLAwpmhZAYFFRaSFQvAwpmhbLFXUkFQX1BBUlRJQUxfRkxBR5MVGx7AwMALkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSZWN1cnJ5LmpzmKFyABHAwJEUwMKZoWQGBRfAkhcLwMKZoWy3V1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUeTFxwdwMDAC5DZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUmVjdXJyeS5qc5ihcgAXwMCRFsDCmaFkARoZwNwAEhobHB0eHyAhIiMkGRIUFhAMDsDCmaFsrWNyZWF0ZVJlY3VycnmSGSfAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSZWN1cnJ5LmpzmKFyCQ3AGpEYwMKYoXJzD8AbkRLAwpihcszvEcAckRTAwpihcgMXwB2RFsDCmKFyGxfAHpEWwMKYoXIDEcAfkRTAwpihchYVwCCREMDCmKFyFg7AIZEMwMKYoXIDEsAikQ7Awpihcsy8CsAjkQHAwpihcg4HwCSRBMDCmKFyRQ/AwJEHwMKYoWcBAybAkMDCmKFnCQsnwJEnwMKYoXIADcDAkRjAwg==
====catalogjs annotation end====*/