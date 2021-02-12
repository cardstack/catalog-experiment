import { default as baseRest } from "./dist/49.js";
import { default as eq } from "./eq.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as keysIn } from "./keysIn.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var defaults = baseRest(function (object, sources) {
  object = Object(object);
  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined || eq(value, objectProto[key]) && !hasOwnProperty0.call(object, key)) {
        object[key] = source[key];
      }
    }
  }

  return object;
});
export { defaults as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqcuL2VxLmpzBsLAlcKsLi9kaXN0LzcwLmpzCcLAlcKrLi9rZXlzSW4uanMMwsCBp2RlZmF1bHSVoWyoZGVmYXVsdHMgwMDcACKXoW8AAAPAkRbAmaFkCQACwJECwMKZoWmoYmFzZVJlc3SSAhnAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpomVxkgUcwAGnZGVmYXVsdMDAwJihcgsCwMCRBMDCnKFpARIECZDAwgHCwMCZoWQJAAjAkQjAwpmhaa5pc0l0ZXJhdGVlQ2FsbJIIGsACp2RlZmF1bHTAwMCYoXILDsDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmma2V5c0lukgsbwAOnZGVmYXVsdMDAwJihcgsGwMCRCsDCnKFpARYKDZDAwgPCwMCXoW8BAA4fkMCYoWcAAQ8RkMDCmaFkBBMQwJIQDsDCmaFsq29iamVjdFByb3RvkxAUHcDAwA6Q2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZGVmYXVsdHMuanOYoXIAC8DAkQ/AwpihZwEBEhWQwMKZoWQEDxPAlBQTEQ/AwpmhbK9oYXNPd25Qcm9wZXJ0eTCSEx7AwMARkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2RlZmF1bHRzLmpzmKFyAA/AFJESwMKYoXIDC8DAkQ/AwpihZwEBFsCQwMKZoWQEABfAlRcVGA8SwMKZoWyoZGVmYXVsdHOSFyHAwMAVkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2RlZmF1bHRzLmpzmKFyAAjAGJEWwMKYoWcDXxnAlhkaGxwdHsDCmKFyAAjAGpEBwMKYoXLMrQ7AG5EHwMKYoXLMhgbAHJEKwMKYoXLM1QLAHZEEwMKYoXIIC8AekQ/AwpihcgsPwMCREsDCmKFnAQMgwJDAwpihZwkLIcCRIcDCmKFyAAjAwJEWwMI=
====catalogjs annotation end====*/