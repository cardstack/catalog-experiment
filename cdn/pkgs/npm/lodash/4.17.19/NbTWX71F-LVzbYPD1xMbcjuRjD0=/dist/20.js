import { default as root } from "./93.js";
import { default as toInteger } from "../toInteger.js";
import { default as toNumber } from "../toNumber.js";
import { default as toString0 } from "../toString.js";
var nativeIsFinite = root.isFinite,
    nativeMin = Math.min;
function createRound(methodName) {
  var func = Math[methodName];
  return function (number, precision) {
    number = toNumber(number);
    precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);

    if (precision && nativeIsFinite(number)) {
      var pair = (toString0(number) + 'e').split('e'),
          value = func(pair[0] + 'e' + (+pair[1] + precision));
      pair = (toString0(value) + 'e').split('e');
      return +(pair[0] + 'e' + (+pair[1] - precision));
    }

    return func(number);
  };
}
export { createRound as default };
/*====catalogjs annotation start====
k5SVwqcuLzkzLmpzA8LAlcKvLi4vdG9JbnRlZ2VyLmpzB8LAlcKuLi4vdG9OdW1iZXIuanMLwsCVwq4uLi90b1N0cmluZy5qcw/CwIGnZGVmYXVsdJWhbKtjcmVhdGVSb3VuZCHAwNwAI5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFppHJvb3SSAhXAAKdkZWZhdWx0wMDAmKFyCwTAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmpdG9JbnRlZ2VykgYcwAGnZGVmYXVsdMDAwJihcgsJwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCBHAwJDAwpmhZAkACgyRCsDCmaFpqHRvTnVtYmVykgoawAKnZGVmYXVsdMDAwJihcgsIwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCBDAwJDAwpmhZAkADhCRDsDCmaFpqXRvU3RyaW5nMJMOHh/AA6dkZWZhdWx0wMDAmKFyCwnAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcIEMDAkMDCl6FvAQASIJDAmKFnAAETGJDAwpmhZAQJFBaTFRQSwMKZoWyubmF0aXZlSXNGaW5pdGWSFB3AwMASkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSb3VuZC5qc5ihcgAOwBWRE8DCmKFyAwTAwJEBwMKZoWQGCxfAkhcSwMKZoWypbmF0aXZlTWlukhcbwMDAEpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUm91bmQuanOYoXIACcDAkRbAwpmhZAF5GcCZGhscHR4fGRYTwMKZoWyrY3JlYXRlUm91bmSSGSLAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSb3VuZC5qc5ihcgkLwBqRGMDCmKFyYwjAG5EJwMKYoXIyCcAckRbAwpihcgEJwB2RBcDCmKFyKQ7AHpETwMKYoXIeCcAfkQ3AwpihcmoJwMCRDcDCmKFnAQMhwJDAwpihZwkLIsCRIsDCmKFyAAvAwJEYwMI=
====catalogjs annotation end====*/