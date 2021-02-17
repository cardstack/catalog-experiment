import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
var method = baseRest(function (path, args) {
  return function (object) {
    return baseInvoke(object, path, args);
  };
});
export { method as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvOC5qcwPCwJXCrC4vZGlzdC80OS5qcwfCwIGnZGVmYXVsdJWhbKZtZXRob2QRwMDcABOXoW8AAAPAkQvAmaFkCQACBJECwMKZoWmqYmFzZUludm9rZZICD8AAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgNwMCQwMKZoWQJAAYIkQbAwpmhaahiYXNlUmVzdJIGDsABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgOwMCQwMKXoW8BAAoQkMCYoWcAAQvAkMDCmaFkBAAMwJMMCg3AwpmhbKZtZXRob2SSDBLAwMAKkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21ldGhvZC5qc5ihcgAGwA2RC8DCmKFnAx0OwJIOD8DCmKFyAAjAD5EFwMKYoXJBCsDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAGwMCRC8DC
====catalogjs annotation end====*/