import { default as baseAssignValue } from "./dist/56.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);
  baseForOwn(object, function (value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}
export { mapValues as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTYuanMDwsCVwqwuL2Rpc3QvNzcuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwIGnZGVmYXVsdJShbKltYXBWYWx1ZXMRwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaa9iYXNlQXNzaWduVmFsdWWSAg/AAKdkZWZhdWx0wMCYoXILD8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqYmFzZUZvck93bpIFDsABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxiYXNlSXRlcmF0ZWWSCA3AAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEJDAmaFkAEUMwJQNDg8MwMKYoWypbWFwVmFsdWVzkgwSwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21hcFZhbHVlcy5qc5ihcgkJwA2RC8DCmKFyNQzADpEHwMKYoXIRCsAPkQTAwpihci0PwMCRAcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAnAwJELwMI=
====catalogjs annotation end====*/