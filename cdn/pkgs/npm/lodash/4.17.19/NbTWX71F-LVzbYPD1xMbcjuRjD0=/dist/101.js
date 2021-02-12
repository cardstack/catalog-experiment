import { default as LazyWrapper } from "./103.js";
import { default as LodashWrapper } from "./104.js";
import { default as copyArray } from "./117.js";
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }

  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__ = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}
export { wrapperClone as default };
/*====catalogjs annotation start====
k5OVwqguLzEwMy5qcwPCwJXCqC4vMTA0LmpzBsLAlcKoLi8xMTcuanMJwsCBp2RlZmF1bHSVoWysd3JhcHBlckNsb25lEcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmrTGF6eVdyYXBwZXKSAg3AAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAEwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprUxvZGFzaFdyYXBwZXKSBQ7AAadkZWZhdWx0wMDAmKFyCw3AwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqWNvcHlBcnJheZIID8ACp2RlZmF1bHTAwMCYoXILCcDAkQfAwpyhaQETBwqQwMICwsDAl6FvAQALEJDAmaFkAHsMwJQNDg8MwMKZoWysd3JhcHBlckNsb25lkgwSwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fd3JhcHBlckNsb25lLmpzmKFyCQzADZELwMKYoXIlC8AOkQHAwpihcjgNwA+RBMDCmKFyQQnAwJEHwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIADMDAkQvAwg==
====catalogjs annotation end====*/