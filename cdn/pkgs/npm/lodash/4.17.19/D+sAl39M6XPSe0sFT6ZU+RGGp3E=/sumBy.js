import { default as baseIteratee } from "./dist/6.js";
import { default as baseSum } from "./dist/168.js";
function sumBy(array, iteratee) {
  return array && array.length ? baseSum(array, baseIteratee(iteratee, 2)) : 0;
}
export { sumBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNjguanMHwsCBp2RlZmF1bHSVoWylc3VtQnkPwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlSXRlcmF0ZWWSAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDcDAkMDCmaFkCQAGCJEGwMKZoWmnYmFzZVN1bZIGDMABp2RlZmF1bHTAwMCYoXILB8DAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgPwMCQwMKXoW8BAAoOkMCZoWQAFQvAkwwNC8DCmaFspXN1bUJ5kgsQwMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zdW1CeS5qc5ihcgkFwAyRCsDCmKFyNQfADZEFwMKYoXIIDMDAkQHAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAFwMCRCsDC
====catalogjs annotation end====*/