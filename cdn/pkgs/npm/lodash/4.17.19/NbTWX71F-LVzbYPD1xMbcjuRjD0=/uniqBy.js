import { default as baseIteratee } from "./dist/6.js";
import { default as baseUniq } from "./dist/63.js";
function uniqBy(array, iteratee) {
  return array && array.length ? baseUniq(array, baseIteratee(iteratee, 2)) : [];
}
export { uniqBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC82My5qcwfCwIGnZGVmYXVsdJWhbKZ1bmlxQnkPwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlSXRlcmF0ZWWSAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDcDAkMDCmaFkCQAGCJEGwMKZoWmoYmFzZVVuaXGSBgzAAadkZWZhdWx0wMDAmKFyCwjAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIDsDAkMDCl6FvAQAKDpDAmaFkABYLwJMMDQvAwpmhbKZ1bmlxQnmSCxDAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuaXFCeS5qc5ihcgkGwAyRCsDCmKFyNQjADZEFwMKYoXIIDMDAkQHAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAGwMCRCsDC
====catalogjs annotation end====*/