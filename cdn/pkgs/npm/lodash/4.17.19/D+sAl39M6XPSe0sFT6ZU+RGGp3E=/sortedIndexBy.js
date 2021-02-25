import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedIndexBy } from "./dist/31.js";
function sortedIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2));
}
export { sortedIndexBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC8zMS5qcwfCwIGnZGVmYXVsdJWhbK1zb3J0ZWRJbmRleEJ5D8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmsYmFzZUl0ZXJhdGVlkgINwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA3AwJDAwpmhZAkABgiRBsDCmaFpsWJhc2VTb3J0ZWRJbmRleEJ5kgYMwAGnZGVmYXVsdMDAwJihcgsRwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA7AwJDAwpehbwEACg6QwJmhZAARC8CTDA0LwMKZoWytc29ydGVkSW5kZXhCeZILEMDAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc29ydGVkSW5kZXhCeS5qc5ihcgkNwAyRCsDCmKFyJBHADZEFwMKYoXIPDMDAkQHAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgANwMCRCsDC
====catalogjs annotation end====*/