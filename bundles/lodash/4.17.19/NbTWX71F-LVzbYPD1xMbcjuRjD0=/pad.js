import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
var nativeCeil = Math.ceil,
    nativeFloor = Math.floor;
function pad(string, length, chars) {
  string = toString(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;

  if (!length || strLength >= length) {
    return string;
  }

  var mid = (length - strLength) / 2;
  return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
}
export { pad as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFso3BhZB3A3AAfl6FvAAADwJETwJmhZAkAAsCRAsDCmKFprWNyZWF0ZVBhZGRpbmeTAhgawACnZGVmYXVsdMDAmKFyCw3AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqnN0cmluZ1NpemWSBRfAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpdG9JbnRlZ2VykggWwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGQcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqHRvU3RyaW5nkgsVwAOnZGVmYXVsdMDAmKFyCwjAwJEKwMKcoWkBGAoNkMDCA8LAwJehbwEADhyQwJihZwABDxOQwMKZoWQEDBARkhAOwMKYoWyqbmF0aXZlQ2VpbJIQG8DAwA7ZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYWQuanOYoXIACsDAkQ/AwpmhZAYNEsCSEg7AwpihbKtuYXRpdmVGbG9vcpISGcDAwA7ZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYWQuanOYoXIAC8DAkRHAwpmhZAEQFMCaFRYXGBkaGxQRD8DCmKFso3BhZJIUHsDAwMDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYWQuanOYoXIJA8AVkRPAwpihciUIwBaRCsDCmKFyFQnAF5EHwMKYoXIlCsAYkQTAwpihcn4NwBmRAcDCmKFyAQvAGpERwMKYoXIZDcAbkQHAwpihcgEKwMCRD8DCmKFnAQMdwJDAwpihZwkLHsCRHsDCmKFyAAPAwJETwMI=
====catalogjs annotation end====*/