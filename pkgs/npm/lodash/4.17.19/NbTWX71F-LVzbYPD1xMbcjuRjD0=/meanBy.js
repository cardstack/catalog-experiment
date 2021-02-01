import { default as baseIteratee } from "./dist/6.js";
import { default as baseMean } from "./dist/167.js";
function meanBy(array, iteratee) {
  return baseMean(array, baseIteratee(iteratee, 2));
}
export { meanBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNjcuanMGwsCBp2RlZmF1bHSUoWymbWVhbkJ5DcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmsYmFzZUl0ZXJhdGVlkgILwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VNZWFukgUKwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAARCcCTCgsJwMKYoWymbWVhbkJ5kgkOwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21lYW5CeS5qc5ihcgkGwAqRCMDCmKFyHQjAC5EEwMKYoXIIDMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAGwMCRCMDC
====catalogjs annotation end====*/