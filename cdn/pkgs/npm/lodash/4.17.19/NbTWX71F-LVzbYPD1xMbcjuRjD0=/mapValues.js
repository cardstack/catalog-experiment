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
k5OVwqwuL2Rpc3QvNTYuanMDwsCVwqwuL2Rpc3QvNzcuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwIGnZGVmYXVsdJWhbKltYXBWYWx1ZXMRwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaa9iYXNlQXNzaWduVmFsdWWSAg/AAKdkZWZhdWx0wMDAmKFyCw/AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqmJhc2VGb3JPd26SBQ7AAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFprGJhc2VJdGVyYXRlZZIIDcACp2RlZmF1bHTAwMCYoXILDMDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEJDAmaFkAEUMwJQNDg8MwMKZoWypbWFwVmFsdWVzkgwSwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tYXBWYWx1ZXMuanOYoXIJCcANkQvAwpihcjUMwA6RB8DCmKFyEQrAD5EEwMKYoXItD8DAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAJwMCRC8DC
====catalogjs annotation end====*/