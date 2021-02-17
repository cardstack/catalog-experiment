import { default as toNumber } from "./toNumber.js";
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }

  value = toNumber(value);

  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }

  return value === value ? value : 0;
}
export { toFinite as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvTnVtYmVyLmpzA8LAgadkZWZhdWx0laFsqHRvRmluaXRlEsDA3AAUl6FvAAADwJDAmaFkCQACBJECwMKZoWmodG9OdW1iZXKSAg3AAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcID8DAkMDCl6FvAQAGEZDAmKFnAAEHC5DAwpmhZAQICAmSCAbAwpmhbKhJTkZJTklUWZMIDg/AwMAGkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvRmluaXRlLmpzmKFyAAjAwJEHwMKZoWQGGgrAkgoGwMKZoWyrTUFYX0lOVEVHRVKSChDAwMAGkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvRmluaXRlLmpzmKFyAAvAwJEJwMKZoWQBLgzAlw0ODxAMBwnAwpmhbKh0b0Zpbml0ZZIME8DAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9GaW5pdGUuanOYoXIJCMANkQvAwpihck0IwA6RAcDCmKFyGgjAD5EHwMKYoXIPCMAQkQfAwpihcjkLwMCRCcDCmKFnAQMSwJDAwpihZwkLE8CRE8DCmKFyAAjAwJELwMI=
====catalogjs annotation end====*/