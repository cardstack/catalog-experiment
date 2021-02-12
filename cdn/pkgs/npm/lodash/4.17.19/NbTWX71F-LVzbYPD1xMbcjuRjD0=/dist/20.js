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
k5SVwqcuLzkzLmpzA8LAlcKvLi4vdG9JbnRlZ2VyLmpzBsLAlcKuLi4vdG9OdW1iZXIuanMJwsCVwq4uLi90b1N0cmluZy5qcwzCwIGnZGVmYXVsdJWhbKtjcmVhdGVSb3VuZB3AwNwAH5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFppHJvb3SSAhHAAKdkZWZhdWx0wMDAmKFyCwTAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqXRvSW50ZWdlcpIFGMABp2RlZmF1bHTAwMCYoXILCcDAkQTAwpyhaQEaBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmodG9OdW1iZXKSCBbAAqdkZWZhdWx0wMDAmKFyCwjAwJEHwMKcoWkBGQcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqXRvU3RyaW5nMJMLGhvAA6dkZWZhdWx0wMDAmKFyCwnAwJEKwMKcoWkBGQoNkMDCA8LAwJehbwEADhyQwJihZwABDxSQwMKZoWQECRASkxEQDsDCmaFsrm5hdGl2ZUlzRmluaXRlkhAZwMDADpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUm91bmQuanOYoXIADsARkQ/AwpihcgMEwMCRAcDCmaFkBgsTwJITDsDCmaFsqW5hdGl2ZU1pbpITF8DAwA6Q2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVJvdW5kLmpzmKFyAAnAwJESwMKZoWQBeRXAmRYXGBkaGxUSD8DCmaFsq2NyZWF0ZVJvdW5kkhUewMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUm91bmQuanOYoXIJC8AWkRTAwpihcmMIwBeRB8DCmKFyMgnAGJESwMKYoXIBCcAZkQTAwpihcikOwBqRD8DCmKFyHgnAG5EKwMKYoXJqCcDAkQrAwpihZwEDHcCQwMKYoWcJCx7AkR7AwpihcgALwMCRFMDC
====catalogjs annotation end====*/