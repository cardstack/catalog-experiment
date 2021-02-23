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
k5OVwqguLzEwMy5qcwPCwJXCqC4vMTA0LmpzB8LAlcKoLi8xMTcuanMLwsCBp2RlZmF1bHSVoWysd3JhcHBlckNsb25lFMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmrTGF6eVdyYXBwZXKSAhDAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICsDAkMDCmaFkCQAGCJEGwMKZoWmtTG9kYXNoV3JhcHBlcpIGEcABp2RlZmF1bHTAwMCYoXILDcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgKwMCQwMKZoWQJAAoMkQrAwpmhaaljb3B5QXJyYXmSChLAAqdkZWZhdWx0wMDAmKFyCwnAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcICsDAkMDCl6FvAQAOE5DAmaFkAHsPwJQQERIPwMKZoWysd3JhcHBlckNsb25lkg8VwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fd3JhcHBlckNsb25lLmpzmKFyCQzAEJEOwMKYoXIlC8ARkQHAwpihcjgNwBKRBcDCmKFyQQnAwJEJwMKYoWcBAxTAkMDCmKFnCQsVwJEVwMKYoXIADMDAkQ7Awg==
====catalogjs annotation end====*/