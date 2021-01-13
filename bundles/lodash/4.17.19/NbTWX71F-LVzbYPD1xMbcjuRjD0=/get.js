import { default as baseGet } from "./dist/14.js";
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}
export { get as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTQuanMDwsCBp2RlZmF1bHSUoWyjZ2V0CcCbl6FvAAADwJEFwJmhZAkAAsCRAsDCmKFpp2Jhc2VHZXSSAgfAAKdkZWZhdWx0wMCYoXILB8DAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCJDAmaFkAEgGwJIHBsDCmKFso2dldJIGCsDAwMDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9nZXQuanOYoXIJA8AHkQXAwpihcksHwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAPAwJEFwMI=
====catalogjs annotation end====*/