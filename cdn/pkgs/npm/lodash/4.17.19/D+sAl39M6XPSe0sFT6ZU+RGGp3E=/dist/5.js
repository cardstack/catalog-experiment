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
k5aVwqguLzExMS5qcwPCwJXCpy4vOTguanMHwsCVwqYuLzYuanMLwsCVwqcuLzQ5LmpzD8LAlcKoLi8xMzUuanMTwsCVwqcuLzUwLmpzF8LAgadkZWZhdWx0laFsqmNyZWF0ZU92ZXIjwMDcACWXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaVhcHBseZICIcAAp2RlZmF1bHTAwMCYoXILBcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgKwMCQwMKZoWQJAAYIkQbAwpmhaahhcnJheU1hcJIGHcABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgJwMCQwMKZoWQJAAoMkQrAwpmhaaxiYXNlSXRlcmF0ZWWSCh/AAqdkZWZhdWx0wMDAmKFyCwzAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcICMDAkMDCmaFkCQAOEJEOwMKZoWmoYmFzZVJlc3SSDiDAA6dkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcICcDAkMDCmaFkCQASFJESwMKZoWmpYmFzZVVuYXJ5khIewASnZGVmYXVsdMDAwJihcgsJwMCREcDCnKFpAQERF5EUwMIEwsDAmKFnCArAwJDAwpmhZAkAFhiRFsDCmaFpqGZsYXRSZXN0khYcwAWnZGVmYXVsdMDAwJihcgsIwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCAnAwJDAwpehbwEAGiKQwJmhZAA0G8CXHB0eHyAhG8DCmaFsqmNyZWF0ZU92ZXKSGyTAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVPdmVyLmpzmKFyCQrAHJEawMKYoXIXCMAdkRXAwpihcigIwB6RBcDCmKFyDAnAH5ERwMKYoXIBDMAgkQnAwpihcg8IwCGRDcDCmKFydAXAwJEBwMKYoWcBAyPAkMDCmKFnCQskwJEkwMKYoXIACsDAkRrAwg==
====catalogjs annotation end====*/