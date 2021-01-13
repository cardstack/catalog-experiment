import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_PARTIAL_FLAG = 32;
var partial = baseRest(function (func, partials) {
  var holders = replaceHolders(partials, getHolder(partial));
  return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
});
partial.placeholder = {};
export { partial as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJShbKdwYXJ0aWFsHsDcACCXoW8AAAPAkhIbwJmhZAkAAsCRAsDCmKFpqGJhc2VSZXN0kgIVwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmNyZWF0ZVdyYXCSBRnAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpZ2V0SG9sZGVykggXwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmKFprnJlcGxhY2VIb2xkZXJzkgsWwAOnZGVmYXVsdMDAmKFyCw7AwJEKwMKcoWkBGAoNkMDCA8LAwJehbwEADh2QwJihZwABDxGQwMKZoWQEBRDAkxAOG8DCmKFssVdSQVBfUEFSVElBTF9GTEFHkhAawMDADtlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnRpYWwuanOYoXIAEcDAkQ/AwpihZwEBEhuQwMKZoWQEABPAlRMRFA8bwMKYoWyncGFydGlhbJQTGBwfwMDAEdlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnRpYWwuanOYoXIAB8AUkRLAwpihZwMjFcCXFRYXGBkaEsDCmKFyAAjAFpEBwMKYoXItDsAXkQrAwpihcgsJwBiRB8DCmKFyAQfAGZESwMKYoXINCsAakQTAwpihcgcRwMCRD8DCmKFnARIcwJEcwMOYoXIAB8DAkRLAwpihZwEDHsCQwMKYoWcJCx/AkR/AwpihcgAHwMCREsDC
====catalogjs annotation end====*/