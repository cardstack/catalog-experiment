import { default as baseNth } from "./dist/127.js";
import { default as baseRest } from "./dist/49.js";
import { default as toInteger } from "./toInteger.js";
function nthArg(n) {
  n = toInteger(n);
  return baseRest(function (args) {
    return baseNth(args, n);
  });
}
export { nthArg as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTI3LmpzA8LAlcKsLi9kaXN0LzQ5LmpzB8LAlcKuLi90b0ludGVnZXIuanMLwsCBp2RlZmF1bHSVoWymbnRoQXJnFMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmnYmFzZU50aJICEsAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaahiYXNlUmVzdJIGEcABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaal0b0ludGVnZXKSChDAAqdkZWZhdWx0wMDAmKFyCwnAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIEMDAkMDCl6FvAQAOE5DAmaFkABIPwJQQERIPwMKZoWymbnRoQXJnkg8VwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9udGhBcmcuanOYoXIJBsAQkQ7AwpihcgwJwBGRCcDCmKFyDgjAEpEFwMKYoXIeB8DAkQHAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAGwMCRDsDC
====catalogjs annotation end====*/