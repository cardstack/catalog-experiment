import { default as baseAssignValue } from "./56.js";
import { default as eq } from "../eq.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty0.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
export { assignValue as default };
/*====catalogjs annotation start====
k5KVwqcuLzU2LmpzA8LAlcKoLi4vZXEuanMHwsCBp2RlZmF1bHSVoWyrYXNzaWduVmFsdWUXwMDcABmXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaa9iYXNlQXNzaWduVmFsdWWSAhXAAKdkZWZhdWx0wMDAmKFyCw/AwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmiZXGSBhTAAadkZWZhdWx0wMDAmKFyCwLAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcICsDAkMDCl6FvAQAKFpDAmKFnAAELDZDAwpmhZAQTDMCSDArAwpmhbKtvYmplY3RQcm90b5IMEMDAwAqQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Fzc2lnblZhbHVlLmpzmKFyAAvAwJELwMKYoWcBAQ4RkMDCmaFkBA8PwJQQDw0LwMKZoWyvaGFzT3duUHJvcGVydHkwkg8TwMDADZDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXNzaWduVmFsdWUuanOYoXIAD8AQkQ7AwpihcgMLwMCRC8DCmaFkARsSwJUTFBUSDsDCmaFsq2Fzc2lnblZhbHVlkhIYwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXNzaWduVmFsdWUuanOYoXIJC8ATkRHAwpihcj4PwBSRDsDCmKFyFgLAFZEFwMKYoXJFD8DAkQHAwpihZwEDF8CQwMKYoWcJCxjAkRjAwpihcgALwMCREcDC
====catalogjs annotation end====*/