import { default as basePickBy } from "./dist/12.js";
import { default as hasIn } from "./hasIn.js";
import { default as flatRest } from "./dist/50.js";
function basePick(object, paths) {
  return basePickBy(object, paths, function (value, path) {
    return hasIn(object, path);
  });
}
var pick = flatRest(function (object, paths) {
  return object == null ? {} : basePick(object, paths);
});
export { pick as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMTIuanMDwsCVwqouL2hhc0luLmpzBsLAlcKsLi9kaXN0LzUwLmpzCcLAgadkZWZhdWx0laFspHBpY2sXwMDcABmXoW8AAAPAkRHAmaFkCQACwJECwMKZoWmqYmFzZVBpY2tCeZICDcAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmlaGFzSW6SBQ7AAadkZWZhdWx0wMDAmKFyCwXAwJEEwMKcoWkBFQQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqGZsYXRSZXN0kggUwAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARcHCpDAwgLCwMCXoW8BAAsPkMCZoWQAFwzAkw0ODMDCmaFsqGJhc2VQaWNrkgwVwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVBpY2suanOYoXIJCMANkQvAwpihchsKwA6RAcDCmKFyNAXAwJEEwMKXoW8BABAWkMCYoWcAARHAkMDCmaFkBAASwJMSEBPAwpmhbKRwaWNrkhIYwMDAEJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9waWNrLmpzmKFyAATAE5ERwMKYoWcDExTAkhQVwMKYoXIACMAVkQfAwpihcjsIwMCRC8DCmKFnAQMXwJDAwpihZwkLGMCRGMDCmKFyAATAwJERwMI=
====catalogjs annotation end====*/