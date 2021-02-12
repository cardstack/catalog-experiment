import { default as apply } from "./111.js";
import { default as arrayMap } from "./98.js";
import { default as baseIteratee } from "./6.js";
import { default as baseRest } from "./49.js";
import { default as baseUnary } from "./135.js";
import { default as flatRest } from "./50.js";
function createOver(arrayFunc) {
  return flatRest(function (iteratees) {
    iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
    return baseRest(function (args) {
      var thisArg = this;
      return arrayFunc(iteratees, function (iteratee) {
        return apply(iteratee, thisArg, args);
      });
    });
  });
}
export { createOver as default };
/*====catalogjs annotation start====
k5aVwqguLzExMS5qcwPCwJXCpy4vOTguanMGwsCVwqYuLzYuanMJwsCVwqcuLzQ5LmpzDMLAlcKoLi8xMzUuanMPwsCVwqcuLzUwLmpzEsLAgadkZWZhdWx0laFsqmNyZWF0ZU92ZXIdwMDcAB+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaaVhcHBseZICG8AAp2RlZmF1bHTAwMCYoXILBcDAkQHAwpyhaQATAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYXJyYXlNYXCSBRfAAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBEgQJkMDCAcLAwJmhZAkACMCRCMDCmaFprGJhc2VJdGVyYXRlZZIIGcACp2RlZmF1bHTAwMCYoXILDMDAkQfAwpyhaQERBwyQwMICwsDAmaFkCQALwJELwMKZoWmoYmFzZVJlc3SSCxrAA6dkZWZhdWx0wMDAmKFyCwjAwJEKwMKcoWkBEgoPkMDCA8LAwJmhZAkADsCRDsDCmaFpqWJhc2VVbmFyeZIOGMAEp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQETDRKQwMIEwsDAmaFkCQARwJERwMKZoWmoZmxhdFJlc3SSERbABadkZWZhdWx0wMDAmKFyCwjAwJEQwMKcoWkBEhATkMDCBcLAwJehbwEAFByQwJmhZAA0FcCXFhcYGRobFcDCmaFsqmNyZWF0ZU92ZXKSFR7AwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVPdmVyLmpzmKFyCQrAFpEUwMKYoXIXCMAXkRDAwpihcigIwBiRBMDCmKFyDAnAGZENwMKYoXIBDMAakQfAwpihcg8IwBuRCsDCmKFydAXAwJEBwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIACsDAkRTAwg==
====catalogjs annotation end====*/