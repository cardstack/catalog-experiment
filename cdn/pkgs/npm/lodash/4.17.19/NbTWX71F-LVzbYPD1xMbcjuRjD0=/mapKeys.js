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
k5OVwqwuL2Rpc3QvNTYuanMDwsCVwqwuL2Rpc3QvNzcuanMHwsCVwqsuL2Rpc3QvNi5qcwvCwIGnZGVmYXVsdJWhbKdtYXBLZXlzFMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmvYmFzZUFzc2lnblZhbHVlkgISwACnZGVmYXVsdMDAwJihcgsPwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqmJhc2VGb3JPd26SBhHAAadkZWZhdWx0wMDAmKFyCwrAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmsYmFzZUl0ZXJhdGVlkgoQwAKnZGVmYXVsdMDAwJihcgsMwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCA3AwJDAwpehbwEADhOQwJmhZABHD8CUEBESD8DCmaFsp21hcEtleXOSDxXAwMDAkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21hcEtleXMuanOYoXIJB8AQkQ7AwpihcjUMwBGRCcDCmKFyEQrAEpEFwMKYoXItD8DAkQHAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAHwMCRDsDC
====catalogjs annotation end====*/