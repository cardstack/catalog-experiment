import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedIndexBy } from "./dist/31.js";
function sortedLastIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2), true);
}
export { sortedLastIndexBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC8zMS5qcwbCwIGnZGVmYXVsdJWhbLFzb3J0ZWRMYXN0SW5kZXhCeQ3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaaxiYXNlSXRlcmF0ZWWSAgvAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpsWJhc2VTb3J0ZWRJbmRleEJ5kgUKwAGnZGVmYXVsdMDAwJihcgsRwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFwnAkwoLCcDCmaFssXNvcnRlZExhc3RJbmRleEJ5kgkOwMDAwJDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb3J0ZWRMYXN0SW5kZXhCeS5qc5ihcgkRwAqRCMDCmKFyJBHAC5EEwMKYoXIPDMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgARwMCRCMDC
====catalogjs annotation end====*/