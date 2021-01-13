import { default as basePickBy } from "./dist/12.js";
import { default as hasIn } from "./hasIn.js";
import { default as flatRest } from "./dist/50.js";
function basePick(object, paths) {
  return basePickBy(object, paths, function (value, path) {
    return hasIn(object, path);
  });
}
var pick = flatRest(function (object, paths) {
  return object == null ? {} : basePick(object, paths);
});
export { pick as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMTIuanMDwsCVwqouL2hhc0luLmpzBsLAlcKsLi9kaXN0LzUwLmpzCcLAgadkZWZhdWx0lKFspHBpY2sXwNwAGZehbwAAA8CSCxHAmaFkCQACwJECwMKYoWmqYmFzZVBpY2tCeZICDcAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaVoYXNJbpIFDsABp2RlZmF1bHTAwJihcgsFwMCRBMDCnKFpARUECZDAwgHCwMCZoWQJAAjAkQjAwpihaahmbGF0UmVzdJIIFMACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARcHCpDAwgLCwMCXoW8BAAsPkMCZoWQAFwzAkw0ODMDCmKFsqGJhc2VQaWNrkgwVwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUGljay5qc5ihcgkIwA2RC8DCmKFyGwrADpEBwMKYoXI0BcDAkQTAwpehbwEAEBaQwJihZwABEcCQwMKZoWQEABLAkxIQE8DCmKFspHBpY2uSEhjAwMAQ2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGljay5qc5ihcgAEwBOREcDCmKFnAxMUwJMUFRHAwpihcgAIwBWRB8DCmKFyOwjAwJELwMKYoWcBAxfAkMDCmKFnCQsYwJEYwMKYoXIABMDAkRHAwg==
====catalogjs annotation end====*/