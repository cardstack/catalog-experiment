import { default as baseRepeat } from "./dist/169.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function repeat(string, n, guard) {
  if (guard ? isIterateeCall(string, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }

  return baseRepeat(toString0(string), n);
}
export { repeat as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTY5LmpzA8LAlcKsLi9kaXN0LzcwLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0laFspnJlcGVhdBXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmJhc2VSZXBlYXSSAhLAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFprmlzSXRlcmF0ZWVDYWxskgUQwAGnZGVmYXVsdMDAwJihcgsOwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaal0b0ludGVnZXKSCBHAAqdkZWZhdWx0wMDAmKFyCwnAwJEHwMKcoWkBGQcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqXRvU3RyaW5nMJILE8ADp2RlZmF1bHTAwMCYoXILCcDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOFJDAmaFkAA8PwJUQERITD8DCmaFspnJlcGVhdJIPFsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVwZWF0LmpzmKFyCQbAEJEOwMKYoXIjDsARkQTAwpihckYJwBKRB8DCmKFyEwrAE5EBwMKYoXIBCcDAkQrAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAGwMCRDsDC
====catalogjs annotation end====*/