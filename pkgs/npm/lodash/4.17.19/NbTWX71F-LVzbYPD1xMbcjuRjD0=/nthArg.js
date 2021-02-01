import { default as baseNth } from "./dist/127.js";
import { default as baseRest } from "./dist/49.js";
import { default as toInteger } from "./toInteger.js";
function nthArg(n) {
  n = toInteger(n);
  return baseRest(function (args) {
    return baseNth(args, n);
  });
}
export { nthArg as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTI3LmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWymbnRoQXJnEcDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpihaadiYXNlTnRokgIPwACnZGVmYXVsdMDAmKFyCwfAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VSZXN0kgUOwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXRvSW50ZWdlcpIIDcACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHCpDAwgLCwMCXoW8BAAsQkMCZoWQAEgzAlA0ODwzAwpihbKZudGhBcmeSDBLAwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbnRoQXJnLmpzmKFyCQbADZELwMKYoXIMCcAOkQfAwpihcg4IwA+RBMDCmKFyHgfAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABsDAkQvAwg==
====catalogjs annotation end====*/