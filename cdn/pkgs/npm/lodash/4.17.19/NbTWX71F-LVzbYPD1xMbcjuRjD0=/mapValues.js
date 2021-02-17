import { default as baseAssignValue } from "./dist/56.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);
  baseForOwn(object, function (value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}
export { mapValues as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTYuanMDwsCVwqwuL2Rpc3QvNzcuanMHwsCVwqsuL2Rpc3QvNi5qcwvCwIGnZGVmYXVsdJWhbKltYXBWYWx1ZXMUwMDcABaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaa9iYXNlQXNzaWduVmFsdWWSAhLAAKdkZWZhdWx0wMDAmKFyCw/AwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmqYmFzZUZvck93bpIGEcABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaaxiYXNlSXRlcmF0ZWWSChDAAqdkZWZhdWx0wMDAmKFyCwzAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIDcDAkMDCl6FvAQAOE5DAmaFkAEUPwJQQERIPwMKZoWypbWFwVmFsdWVzkg8VwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tYXBWYWx1ZXMuanOYoXIJCcAQkQ7AwpihcjUMwBGRCcDCmKFyEQrAEpEFwMKYoXItD8DAkQHAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAJwMCRDsDC
====catalogjs annotation end====*/