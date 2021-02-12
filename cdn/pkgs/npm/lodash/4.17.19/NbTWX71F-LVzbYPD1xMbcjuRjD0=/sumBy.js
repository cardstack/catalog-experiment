import { default as baseIteratee } from "./dist/6.js";
import { default as baseSum } from "./dist/168.js";
function sumBy(array, iteratee) {
  return array && array.length ? baseSum(array, baseIteratee(iteratee, 2)) : 0;
}
export { sumBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNjguanMGwsCBp2RlZmF1bHSVoWylc3VtQnkNwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmsYmFzZUl0ZXJhdGVlkgILwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaadiYXNlU3VtkgUKwAGnZGVmYXVsdMDAwJihcgsHwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFQnAkwoLCcDCmaFspXN1bUJ5kgkOwMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zdW1CeS5qc5ihcgkFwAqRCMDCmKFyNQfAC5EEwMKYoXIIDMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAFwMCRCMDC
====catalogjs annotation end====*/