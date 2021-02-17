import { default as identity } from "../identity.js";
import { default as metaMap } from "./39.js";
var baseSetData = !metaMap ? identity : function (func, data) {
  metaMap.set(func, data);
  return func;
};
export { baseSetData as default };
/*====catalogjs annotation start====
k5KVwq4uLi9pZGVudGl0eS5qcwPCwJXCpy4vMzkuanMHwsCBp2RlZmF1bHSVoWyrYmFzZVNldERhdGERwMDcABOXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaahpZGVudGl0eZICDsAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgQwMCQwMKZoWQJAAYIkQbAwpmhaadtZXRhTWFwkwYND8ABp2RlZmF1bHTAwMCYoXILB8DAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgJwMCQwMKXoW8BAAoQkMCYoWcAAQvAkMDCmaFkBCIMwJUNDg8MCsDCmaFsq2Jhc2VTZXREYXRhkgwSwMDACpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNldERhdGEuanOYoXIAC8ANkQvAwpihcgQHwA6RBcDCmKFyAwjAD5EBwMKYoXIdB8DAkQXAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgALwMCRC8DC
====catalogjs annotation end====*/