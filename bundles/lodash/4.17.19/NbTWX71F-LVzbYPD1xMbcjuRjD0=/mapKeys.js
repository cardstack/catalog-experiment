import { default as baseAssignValue } from "./dist/56.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function mapKeys(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);
  baseForOwn(object, function (value, key, object) {
    baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}
export { mapKeys as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTYuanMDwsCVwqwuL2Rpc3QvNzcuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwIGnZGVmYXVsdJShbKdtYXBLZXlzEcDcABOXoW8AAAPAkQvAmaFkCQACwJECwMKYoWmvYmFzZUFzc2lnblZhbHVlkgIPwACnZGVmYXVsdMDAmKFyCw/AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmJhc2VGb3JPd26SBQ7AAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggNwAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZABHDMCUDQ4PDMDCmKFsp21hcEtleXOSDBLAwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWFwS2V5cy5qc5ihcgkHwA2RC8DCmKFyNQzADpEHwMKYoXIRCsAPkQTAwpihci0PwMCRAcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAfAwJELwMI=
====catalogjs annotation end====*/