import { default as isArray } from "./isArray.js";
function castArray() {
  if (!arguments.length) {
    return [];
  }

  var value = arguments[0];
  return isArray(value) ? value : [value];
}
export { castArray as default };
/*====catalogjs annotation start====
k5GVwqwuL2lzQXJyYXkuanMDwsCBp2RlZmF1bHSUoWypY2FzdEFycmF5CcCbl6FvAAADwJEFwJmhZAkAAsCRAsDCmKFpp2lzQXJyYXmSAgfAAKdkZWZhdWx0wMCYoXILB8DAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCJDAmaFkABwGwJIHBsDCmKFsqWNhc3RBcnJheZIGCsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jYXN0QXJyYXkuanOYoXIJCcAHkQXAwpihclkHwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAnAwJEFwMI=
====catalogjs annotation end====*/