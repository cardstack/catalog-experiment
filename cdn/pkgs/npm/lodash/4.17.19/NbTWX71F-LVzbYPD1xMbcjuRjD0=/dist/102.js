import { default as LazyWrapper } from "./103.js";
import { default as arrayPush } from "./139.js";
import { default as arrayReduce } from "./146.js";
function baseWrapperValue(value, actions) {
  var result = value;

  if (result instanceof LazyWrapper) {
    result = result.value();
  }

  return arrayReduce(actions, function (result, action) {
    return action.func.apply(action.thisArg, arrayPush([result], action.args));
  }, result);
}
export { baseWrapperValue as default };
/*====catalogjs annotation start====
k5OVwqguLzEwMy5qcwPCwJXCqC4vMTM5LmpzBsLAlcKoLi8xNDYuanMJwsCBp2RlZmF1bHSVoWywYmFzZVdyYXBwZXJWYWx1ZRHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq0xhenlXcmFwcGVykgINwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABMBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaalhcnJheVB1c2iSBQ/AAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpq2FycmF5UmVkdWNlkggOwAKnZGVmYXVsdMDAwJihcgsLwMCRB8DCnKFpARMHCpDAwgLCwMCXoW8BAAsQkMCZoWQAKQzAlA0ODwzAwpmhbLBiYXNlV3JhcHBlclZhbHVlkgwSwMDAwJDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVdyYXBwZXJWYWx1ZS5qc5ihcgkQwA2RC8DCmKFyQgvADpEBwMKYoXIvC8APkQfAwpihclMJwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyABDAwJELwMI=
====catalogjs annotation end====*/