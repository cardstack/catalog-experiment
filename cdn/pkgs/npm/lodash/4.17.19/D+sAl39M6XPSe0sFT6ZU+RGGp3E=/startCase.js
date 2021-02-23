import { default as createCompounder } from "./dist/19.js";
import { default as upperFirst } from "./upperFirst.js";
var startCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + upperFirst(word);
});
export { startCase as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMTkuanMDwsCVwq8uL3VwcGVyRmlyc3QuanMHwsCBp2RlZmF1bHSVoWypc3RhcnRDYXNlEcDA3AATl6FvAAADwJELwJmhZAkAAgSRAsDCmaFpsGNyZWF0ZUNvbXBvdW5kZXKSAg7AAKdkZWZhdWx0wMDAmKFyCxDAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmqdXBwZXJGaXJzdJIGD8ABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgRwMCQwMKXoW8BAAoQkMCYoWcAAQvAkMDCmaFkBAAMwJMMCg3AwpmhbKlzdGFydENhc2WSDBLAwMAKkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3N0YXJ0Q2FzZS5qc5ihcgAJwA2RC8DCmKFnAwoOwJIOD8DCmKFyABDAD5EBwMKYoXJJCsDAkQXAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAJwMCRC8DC
====catalogjs annotation end====*/