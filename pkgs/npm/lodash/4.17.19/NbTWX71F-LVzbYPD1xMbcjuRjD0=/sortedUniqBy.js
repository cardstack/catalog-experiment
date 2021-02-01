import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedUniq } from "./dist/131.js";
function sortedUniqBy(array, iteratee) {
  return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee, 2)) : [];
}
export { sortedUniqBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xMzEuanMGwsCBp2RlZmF1bHSUoWysc29ydGVkVW5pcUJ5DcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmsYmFzZUl0ZXJhdGVlkgILwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmKFprmJhc2VTb3J0ZWRVbmlxkgUKwAGnZGVmYXVsdMDAmKFyCw7AwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAAWCcCTCgsJwMKYoWysc29ydGVkVW5pcUJ5kgkOwMDAwNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NvcnRlZFVuaXFCeS5qc5ihcgkMwAqRCMDCmKFyNQ7AC5EEwMKYoXIIDMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAMwMCRCMDC
====catalogjs annotation end====*/