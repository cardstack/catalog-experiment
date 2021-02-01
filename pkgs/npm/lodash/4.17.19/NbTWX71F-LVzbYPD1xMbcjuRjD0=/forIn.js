import { default as baseFor } from "./dist/158.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";
function forIn(object, iteratee) {
  return object == null ? object : baseFor(object, castFunction(iteratee), keysIn);
}
export { forIn as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU4LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwbCwJXCqy4va2V5c0luLmpzCcLAgadkZWZhdWx0lKFspWZvckluEcDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpihaadiYXNlRm9ykgINwACnZGVmYXVsdMDAmKFyCwfAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGNhc3RGdW5jdGlvbpIFDsABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaaZrZXlzSW6SCA/AAqdkZWZhdWx0wMCYoXILBsDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEJDAmaFkAAQMwJQNDg8MwMKYoWylZm9ySW6SDBLAwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZm9ySW4uanOYoXIJBcANkQvAwpihcjgHwA6RAcDCmKFyCQzAD5EEwMKYoXIMBsDAkQfAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAFwMCRC8DC
====catalogjs annotation end====*/