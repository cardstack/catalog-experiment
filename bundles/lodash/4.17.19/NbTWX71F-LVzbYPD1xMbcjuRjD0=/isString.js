import { default as baseGetTag } from "./dist/86.js";
import { default as isArray } from "./isArray.js";
import { default as isObjectLike } from "./isObjectLike.js";
var stringTag = '[object String]';
function isString(value) {
  return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}
export { isString as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODYuanMDwsCVwqwuL2lzQXJyYXkuanMGwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwnCwIGnZGVmYXVsdJShbKhpc1N0cmluZxXA3AAXl6FvAAADwJEOwJmhZAkAAsCRAsDCmKFpqmJhc2VHZXRUYWeSAhLAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmnaXNBcnJheZIFEMABp2RlZmF1bHTAwJihcgsHwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxpc09iamVjdExpa2WSCBHAAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEcBwqQwMICwsDAl6FvAQALFJDAmKFnAAEMDpDAwpmhZAQUDcCSDQvAwpihbKlzdHJpbmdUYWeSDRPAwMAL2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNTdHJpbmcuanOYoXIACcDAkQzAwpmhZAEDD8CWEBESEw8MwMKYoWyoaXNTdHJpbmeSDxbAwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNTdHJpbmcuanOYoXIJCMAQkQ7AwpihcjAHwBGRBMDCmKFyCwzAEpEHwMKYoXILCsATkQHAwpihcgsJwMCRDMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAjAwJEOwMI=
====catalogjs annotation end====*/