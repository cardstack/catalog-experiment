import { default as baseFlatten } from "./dist/85.js";
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}
export { flatten as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvODUuanMDwsCBp2RlZmF1bHSUoWynZmxhdHRlbgnAm5ehbwAAA8CRBcCZoWQJAALAkQLAwpihaatiYXNlRmxhdHRlbpICB8AAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUIkMCZoWQAEgbAkgcGwMKYoWynZmxhdHRlbpIGCsDAwMDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mbGF0dGVuLmpzmKFyCQfAB5EFwMKYoXJNC8DAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAHwMCRBcDC
====catalogjs annotation end====*/