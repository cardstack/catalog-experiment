import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedIndexBy } from "./dist/31.js";
function sortedLastIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2), true);
}
export { sortedLastIndexBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC8zMS5qcwbCwIGnZGVmYXVsdJShbLFzb3J0ZWRMYXN0SW5kZXhCeQ3An5ehbwAAA8CRCMCZoWQJAALAkQLAwpihaaxiYXNlSXRlcmF0ZWWSAgvAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmxYmFzZVNvcnRlZEluZGV4QnmSBQrAAadkZWZhdWx0wMCYoXILEcDAkQTAwpyhaQEXBAeQwMIBwsDAl6FvAQAIDJDAmaFkABcJwJMKCwnAwpihbLFzb3J0ZWRMYXN0SW5kZXhCeZIJDsDAwMDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb3J0ZWRMYXN0SW5kZXhCeS5qc5ihcgkRwAqRCMDCmKFyJBHAC5EEwMKYoXIPDMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgARwMCRCMDC
====catalogjs annotation end====*/