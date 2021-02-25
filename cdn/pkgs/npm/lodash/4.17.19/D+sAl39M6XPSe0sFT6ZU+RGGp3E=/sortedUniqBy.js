import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedUniq } from "./dist/131.js";
function sortedUniqBy(array, iteratee) {
  return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee, 2)) : [];
}
export { sortedUniqBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xMzEuanMHwsCBp2RlZmF1bHSVoWysc29ydGVkVW5pcUJ5D8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmsYmFzZUl0ZXJhdGVlkgINwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA3AwJDAwpmhZAkABgiRBsDCmaFprmJhc2VTb3J0ZWRVbmlxkgYMwAGnZGVmYXVsdMDAwJihcgsOwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEACg6QwJmhZAAWC8CTDA0LwMKZoWysc29ydGVkVW5pcUJ5kgsQwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb3J0ZWRVbmlxQnkuanOYoXIJDMAMkQrAwpihcjUOwA2RBcDCmKFyCAzAwJEBwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIADMDAkQrAwg==
====catalogjs annotation end====*/