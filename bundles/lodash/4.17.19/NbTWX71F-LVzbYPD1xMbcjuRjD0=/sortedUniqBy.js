import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedUniq } from "./dist/131.js";
function sortedUniqBy(array, iteratee) {
  return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee, 2)) : [];
}
export { sortedUniqBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xMzEuanMGwsCBp2RlZmF1bHSUoWysc29ydGVkVW5pcUJ5DcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFprGJhc2VJdGVyYXRlZZICC8AAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa5iYXNlU29ydGVkVW5pcZIFCsABp2RlZmF1bHTAwJihcgsOwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFgnAkwoLCcDCmKFsrHNvcnRlZFVuaXFCeZIJDsDAwMDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb3J0ZWRVbmlxQnkuanOYoXIJDMAKkQjAwpihcjUOwAuRBMDCmKFyCAzAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIADMDAkQjAwg==
====catalogjs annotation end====*/