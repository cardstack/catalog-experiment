import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
function startsWith(string, target, position) {
  string = toString(string);
  position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
  target = baseToString(target);
  return string.slice(position, position + target.length) == target;
}
export { startsWith as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKsLi9kaXN0LzIyLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFsqnN0YXJ0c1dpdGgVwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqWJhc2VDbGFtcJICEcAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxiYXNlVG9TdHJpbmeSBRPAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpdG9JbnRlZ2VykggSwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGQcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqHRvU3RyaW5nkgsQwAOnZGVmYXVsdMDAmKFyCwjAwJEKwMKcoWkBGAoNkMDCA8LAwJehbwEADhSQwJmhZABQD8CVEBESEw/AwpihbKpzdGFydHNXaXRokg8WwMDAwNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3N0YXJ0c1dpdGguanOYoXIJCsAQkQ7AwpihcigIwBGRCsDCmKFyLgnAEpEBwMKYoXIBCcATkQfAwpihcioMwMCRBMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAArAwJEOwMI=
====catalogjs annotation end====*/