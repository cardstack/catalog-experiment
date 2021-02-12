import { default as baseEachRight } from "./dist/78.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseReduce } from "./dist/172.js";
import { default as isArray } from "./isArray.js";
function arrayReduceRight(array, iteratee, accumulator, initAccum) {
  var length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[--length];
  }

  while (length--) {
    accumulator = iteratee(accumulator, array[length], length, array);
  }

  return accumulator;
}
function reduceRight(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduceRight : baseReduce,
      initAccum = arguments.length < 3;
  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
}
export { reduceRight as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNzguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrS4vZGlzdC8xNzIuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCBp2RlZmF1bHSVoWyrcmVkdWNlUmlnaHQZwMDcABuXoW8AAAPAkMCZoWQJAALAkQLAwpmhaa1iYXNlRWFjaFJpZ2h0kgIXwACnZGVmYXVsdMDAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxiYXNlSXRlcmF0ZWWSBRbAAadkZWZhdWx0wMDAmKFyCwzAwJEEwMKcoWkBFgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqmJhc2VSZWR1Y2WSCBXAAqdkZWZhdWx0wMDAmKFyCwrAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpp2lzQXJyYXmSCxPAA6dkZWZhdWx0wMDAmKFyCwfAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhCQwJmhZADNARsPwJEPwMKZoWywYXJyYXlSZWR1Y2VSaWdodJIPFMDAwMCQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5UmVkdWNlUmlnaHQuanOYoXIJEMDAkQ7AwpehbwEAERiQwJmhZAAEEsCWExQVFhcSwMKZoWyrcmVkdWNlUmlnaHSSEhrAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3JlZHVjZVJpZ2h0LmpzmKFyCQvAE5ERwMKYoXIzB8AUkQrAwpihcg8QwBWRDsDCmKFyAwrAFpEHwMKYoXJEDMAXkQTAwpihcicNwMCRAcDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAAvAwJERwMI=
====catalogjs annotation end====*/