import { default as baseSlice } from "./dist/142.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
function slice(array, start, end) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
    start = 0;
    end = length;
  } else {
    start = start == null ? 0 : toInteger(start);
    end = end === undefined ? length : toInteger(end);
  }

  return baseSlice(array, start, end);
}
export { slice as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTQyLmpzA8LAlcKsLi9kaXN0LzcwLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWylc2xpY2USwNwAFJehbwAAA8CRC8CZoWQJAALAkQLAwpihaaliYXNlU2xpY2WSAhDAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmuaXNJdGVyYXRlZUNhbGySBQ3AAadkZWZhdWx0wMCYoXILDsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpdG9JbnRlZ2VykwgOD8ACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHCpDAwgLCwMCXoW8BAAsRkMCZoWQAFgzAlQ0ODxAMwMKYoWylc2xpY2WSDBPAwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2xpY2UuanOYoXIJBcANkQvAwpihcsyUDsAOkQTAwpihcmMJwA+RB8DCmKFyMAnAEJEHwMKYoXIVCcDAkQHAwpihZwEDEsCQwMKYoWcJCxPAkRPAwpihcgAFwMCRC8DC
====catalogjs annotation end====*/