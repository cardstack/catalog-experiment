import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function startsWith(string, target, position) {
  string = toString0(string);
  position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
  target = baseToString(target);
  return string.slice(position, position + target.length) == target;
}
export { startsWith as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKsLi9kaXN0LzIyLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0laFsqnN0YXJ0c1dpdGgVwMDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaliYXNlQ2xhbXCSAhHAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGJhc2VUb1N0cmluZ5IFE8ABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmpdG9JbnRlZ2VykggSwAKnZGVmYXVsdMDAwJihcgsJwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaal0b1N0cmluZzCSCxDAA6dkZWZhdWx0wMDAmKFyCwnAwJEKwMKcoWkBGAoNkMDCA8LAwJehbwEADhSQwJmhZABQD8CVEBESEw/AwpmhbKpzdGFydHNXaXRokg8WwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zdGFydHNXaXRoLmpzmKFyCQrAEJEOwMKYoXIoCcARkQrAwpihci4JwBKRAcDCmKFyAQnAE5EHwMKYoXIqDMDAkQTAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAKwMCRDsDC
====catalogjs annotation end====*/