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
k5OVwq0uL2Rpc3QvMTI3LmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWymbnRoQXJnEcDcABOXoW8AAAPAkQvAmaFkCQACwJECwMKYoWmnYmFzZU50aJICD8AAp2RlZmF1bHTAwJihcgsHwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahiYXNlUmVzdJIFDsABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCA3AAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwqQwMICwsDAl6FvAQALEJDAmaFkABIMwJQNDg8MwMKYoWymbnRoQXJnkgwSwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL250aEFyZy5qc5ihcgkGwA2RC8DCmKFyDAnADpEHwMKYoXIOCMAPkQTAwpihch4HwMCRAcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAbAwJELwMI=
====catalogjs annotation end====*/