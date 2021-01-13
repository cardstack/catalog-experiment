import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as basePickBy } from "./dist/12.js";
import { default as getAllKeysIn } from "./dist/80.js";
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }

  var props = arrayMap(getAllKeysIn(object), function (prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function (value, path) {
    return predicate(value, path[0]);
  });
}
export { pickBy as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrC4vZGlzdC8xMi5qcwnCwJXCrC4vZGlzdC84MC5qcwzCwIGnZGVmYXVsdJShbKZwaWNrQnkVwNwAF5ehbwAAA8CRDsCZoWQJAALAkQLAwpihaahhcnJheU1hcJICEMAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxiYXNlSXRlcmF0ZWWSBRLAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEWBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmqYmFzZVBpY2tCeZIIE8ACp2RlZmF1bHTAwJihcgsKwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihaaxnZXRBbGxLZXlzSW6SCxHAA6dkZWZhdWx0wMCYoXILDMDAkQrAwpyhaQEXCg2QwMIDwsDAl6FvAQAOFJDAmaFkAFYPwJUQERITD8DCmKFspnBpY2tCeZIPFsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9waWNrQnkuanOYoXIJBsAQkQ7AwpihclAIwBGRAcDCmKFyAQzAEpEKwMKYoXJDDMATkQTAwpihchYKwMCRB8DCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAbAwJEOwMI=
====catalogjs annotation end====*/