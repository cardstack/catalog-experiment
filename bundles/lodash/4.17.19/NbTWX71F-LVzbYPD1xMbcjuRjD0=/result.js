import { default as castPath } from "./dist/17.js";
import { default as isFunction } from "./isFunction.js";
import { default as toKey } from "./dist/27.js";
function result(object, path, defaultValue) {
  path = castPath(path, object);
  var index = -1,
      length = path.length;

  if (!length) {
    length = 1;
    object = undefined;
  }

  while (++index < length) {
    var value = object == null ? undefined : object[toKey(path[index])];

    if (value === undefined) {
      index = length;
      value = defaultValue;
    }

    object = isFunction(value) ? value.call(object) : value;
  }

  return object;
}
export { result as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMTcuanMDwsCVwq8uL2lzRnVuY3Rpb24uanMGwsCVwqwuL2Rpc3QvMjcuanMJwsCBp2RlZmF1bHSUoWymcmVzdWx0EcDcABOXoW8AAAPAkQvAmaFkCQACwJECwMKYoWmoY2FzdFBhdGiSAg3AAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqaXNGdW5jdGlvbpIFD8ABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARoECZDAwgHCwMCZoWQJAAjAkQjAwpihaaV0b0tleZIIDsACp2RlZmF1bHTAwJihcgsFwMCRB8DCnKFpARcHCpDAwgLCwMCXoW8BAAsQkMCZoWQAPQzAlA0ODwzAwpihbKZyZXN1bHSSDBLAwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVzdWx0LmpzmKFyCQbADZELwMKYoXIoCMAOkQHAwpihcszOBcAPkQfAwpihcnYKwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAbAwJELwMI=
====catalogjs annotation end====*/