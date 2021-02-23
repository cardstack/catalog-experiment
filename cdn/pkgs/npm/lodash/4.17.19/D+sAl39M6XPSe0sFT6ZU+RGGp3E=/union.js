import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var union = baseRest(function (arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
export { union as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvODUuanMDwsCVwqwuL2Rpc3QvNDkuanMHwsCVwqwuL2Rpc3QvNjMuanMLwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzD8LAgadkZWZhdWx0laFspXVuaW9uG8DA3AAdl6FvAAADwJETwJmhZAkAAgSRAsDCmaFpq2Jhc2VGbGF0dGVukgIYwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqGJhc2VSZXN0kgYWwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFpqGJhc2VVbmlxkgoXwAKnZGVmYXVsdMDAwJihcgsIwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA7AwJDAwpmhZAkADhCRDsDCmaFpsWlzQXJyYXlMaWtlT2JqZWN0kg4ZwAOnZGVmYXVsdMDAwJihcgsRwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCBjAwJDAwpehbwEAEhqQwJihZwABE8CQwMKZoWQEABTAkxQSFcDCmaFspXVuaW9ukhQcwMDAEpDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmlvbi5qc5ihcgAFwBWRE8DCmKFnAwwWwJQWFxgZwMKYoXIACMAXkQXAwpihch4IwBiRCcDCmKFyAQvAGZEBwMKYoXIMEcDAkQ3AwpihZwEDG8CQwMKYoWcJCxzAkRzAwpihcgAFwMCRE8DC
====catalogjs annotation end====*/