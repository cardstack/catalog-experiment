import { default as baseIteratee } from "./dist/6.js";
import { default as negate } from "./negate.js";
import { default as pickBy } from "./pickBy.js";
function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}
export { omitBy as default };
/*====catalogjs annotation start====
k5OVwqsuL2Rpc3QvNi5qcwPCwJXCqy4vbmVnYXRlLmpzBsLAlcKrLi9waWNrQnkuanMJwsCBp2RlZmF1bHSVoWymb21pdEJ5EcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmsYmFzZUl0ZXJhdGVlkgIPwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaZuZWdhdGWSBQ7AAadkZWZhdWx0wMDAmKFyCwbAwJEEwMKcoWkBFgQJkMDCAcLAwJmhZAkACMCRCMDCmaFppnBpY2tCeZIIDcACp2RlZmF1bHTAwMCYoXILBsDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEJDAmaFkABAMwJQNDg8MwMKZoWymb21pdEJ5kgwSwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9vbWl0QnkuanOYoXIJBsANkQvAwpihch8GwA6RB8DCmKFyCQbAD5EEwMKYoXIBDMDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAGwMCRC8DC
====catalogjs annotation end====*/