import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedIndexBy } from "./dist/31.js";
function sortedLastIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2), true);
}
export { sortedLastIndexBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC8zMS5qcwbCwIGnZGVmYXVsdJShbLFzb3J0ZWRMYXN0SW5kZXhCeQ3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprGJhc2VJdGVyYXRlZZICC8AAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpihabFiYXNlU29ydGVkSW5kZXhCeZIFCsABp2RlZmF1bHTAwJihcgsRwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFwnAkwoLCcDCmKFssXNvcnRlZExhc3RJbmRleEJ5kgkOwMDAwNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NvcnRlZExhc3RJbmRleEJ5LmpzmKFyCRHACpEIwMKYoXIkEcALkQTAwpihcg8MwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyABHAwJEIwMI=
====catalogjs annotation end====*/