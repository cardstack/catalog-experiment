import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_BIND_FLAG = 1,
    WRAP_PARTIAL_FLAG = 32;
var bind = baseRest(function (func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(func, bitmask, thisArg, partials, holders);
});
bind.placeholder = {};
export { bind as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJShbKRiaW5kIcDcACOXoW8AAAPAkhQewJmhZAkAAsCRAsDCmKFpqGJhc2VSZXN0kgIXwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmNyZWF0ZVdyYXCSBR3AAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpZ2V0SG9sZGVykggawAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmKFprnJlcGxhY2VIb2xkZXJzkgsZwAOnZGVmYXVsdMDAmKFyCw7AwJEKwMKcoWkBGAoNkMDCA8LAwJehbwEADiCQwJihZwABDxOQwMKZoWQEBBARkxAOHsDCmKFsrldSQVBfQklORF9GTEFHkhAYwMDADtlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmQuanOYoXIADsDAkQ/AwpmhZAYFEsCTEg4ewMKYoWyxV1JBUF9QQVJUSUFMX0ZMQUeSEhzAwMAO2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZC5qc5ihcgARwMCREcDCmKFnAQEUHpDAwpmhZAQAFcCWFRMWDxEewMKYoWykYmluZJQVGx8iwMDAE9lEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmQuanOYoXIABMAWkRTAwpihZwMvF8CYFxgZGhscHRTAwpihcgAIwBiRAcDCmKFyNg7AGZEPwMKYoXIuDsAakQrAwpihcgsJwBuRB8DCmKFyAQTAHJEUwMKYoXITEcAdkRHAwpihchAKwMCRBMDCmKFnARIfwJEfwMOYoXIABMDAkRTAwpihZwEDIcCQwMKYoWcJCyLAkSLAwpihcgAEwMCRFMDC
====catalogjs annotation end====*/