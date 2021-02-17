import { default as castSlice } from "./140.js";
import { default as hasUnicode } from "./145.js";
import { default as stringToArray } from "./143.js";
import { default as toString0 } from "../toString.js";
function createCaseFirst(methodName) {
  return function (string) {
    string = toString0(string);
    var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
    var chr = strSymbols ? strSymbols[0] : string.charAt(0);
    var trailing = strSymbols ? castSlice(strSymbols, 1).join('') : string.slice(1);
    return chr[methodName]() + trailing;
  };
}
export { createCaseFirst as default };
/*====catalogjs annotation start====
k5SVwqguLzE0MC5qcwPCwJXCqC4vMTQ1LmpzB8LAlcKoLi8xNDMuanMLwsCVwq4uLi90b1N0cmluZy5qcw/CwIGnZGVmYXVsdJWhbK9jcmVhdGVDYXNlRmlyc3QZwMDcABuXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaljYXN0U2xpY2WSAhfAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICsDAkMDCmaFkCQAGCJEGwMKZoWmqaGFzVW5pY29kZZIGFcABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgKwMCQwMKZoWQJAAoMkQrAwpmhaa1zdHJpbmdUb0FycmF5kgoWwAKnZGVmYXVsdMDAwJihcgsNwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCArAwJDAwpmhZAkADhCRDsDCmaFpqXRvU3RyaW5nMJIOFMADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgQwMCQwMKXoW8BABIYkMCZoWQAWxPAlRQVFhcTwMKZoWyvY3JlYXRlQ2FzZUZpcnN0khMawMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlQ2FzZUZpcnN0LmpzmKFyCQ/AFJESwMKYoXI5CcAVkQ3Awpihch8KwBaRBcDCmKFyCw3AF5EJwMKYoXJzCcDAkQHAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAPwMCREsDC
====catalogjs annotation end====*/