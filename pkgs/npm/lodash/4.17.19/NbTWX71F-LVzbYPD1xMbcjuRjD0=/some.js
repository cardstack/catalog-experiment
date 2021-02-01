import { default as baseEach } from "./dist/75.js";
import { default as arraySome } from "./dist/151.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";
function baseSome(collection, predicate) {
  var result;
  baseEach(collection, function (value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}
function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;

  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }

  return func(collection, baseIteratee(predicate, 3));
}
export { some as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvNzUuanMDwsCVwq0uL2Rpc3QvMTUxLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwqwuL2Rpc3QvNzAuanMPwsCBp2RlZmF1bHSUoWykc29tZR3A3AAfl6FvAAADwJDAmaFkCQACwJECwMKYoWmoYmFzZUVhY2iSAhPAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpYXJyYXlTb21lkgUYwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGJhc2VJdGVyYXRlZZIIG8ACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpihaadpc0FycmF5kgsXwAOnZGVmYXVsdMDAmKFyCwfAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmKFprmlzSXRlcmF0ZWVDYWxskg4awASnZGVmYXVsdMDAmKFyCw7AwJENwMKcoWkBFw0QkMDCBMLAwJehbwEAERSQwJmhZADMkxLAkhMSwMKYoWyoYmFzZVNvbWWSEhnAwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VTb21lLmpzmKFyCQjAE5ERwMKYoXIqCMDAkQHAwpehbwEAFRyQwJmhZAASFsCWFxgZGhsWwMKYoWykc29tZZIWHsDAwMDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb21lLmpzmKFyCQTAF5EVwMKYoXIuB8AYkQrAwpihcg8JwBmRBMDCmKFyAwjAGpERwMKYoXISDsAbkQ3AwpihclwMwMCRB8DCmKFnAQMdwJDAwpihZwkLHsCRHsDCmKFyAATAwJEVwMI=
====catalogjs annotation end====*/