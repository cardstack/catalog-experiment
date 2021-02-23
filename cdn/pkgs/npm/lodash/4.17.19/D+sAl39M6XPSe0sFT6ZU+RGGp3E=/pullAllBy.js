import { default as baseIteratee } from "./dist/6.js";
import { default as basePullAll } from "./dist/97.js";
function pullAllBy(array, values, iteratee) {
  return array && array.length && values && values.length ? basePullAll(array, values, baseIteratee(iteratee, 2)) : array;
}
export { pullAllBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC85Ny5qcwfCwIGnZGVmYXVsdJWhbKlwdWxsQWxsQnkPwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlSXRlcmF0ZWWSAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDcDAkMDCmaFkCQAGCJEGwMKZoWmrYmFzZVB1bGxBbGySBgzAAadkZWZhdWx0wMDAmKFyCwvAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIDsDAkMDCl6FvAQAKDpDAmaFkABkLwJMMDQvAwpmhbKlwdWxsQWxsQnmSCxDAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3B1bGxBbGxCeS5qc5ihcgkJwAyRCsDCmKFyWAvADZEFwMKYoXIQDMDAkQHAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAJwMCRCsDC
====catalogjs annotation end====*/