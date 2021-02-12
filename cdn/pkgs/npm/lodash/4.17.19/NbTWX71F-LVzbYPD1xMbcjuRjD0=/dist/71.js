import { default as baseGetAllKeys } from "./99.js";
import { default as getSymbols } from "./149.js";
import { default as keys } from "../keys.js";
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}
export { getAllKeys as default };
/*====catalogjs annotation start====
k5OVwqcuLzk5LmpzA8LAlcKoLi8xNDkuanMGwsCVwqouLi9rZXlzLmpzCcLAgadkZWZhdWx0laFsqmdldEFsbEtleXMRwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaa5iYXNlR2V0QWxsS2V5c5ICDcAAp2RlZmF1bHTAwMCYoXILDsDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmqZ2V0U3ltYm9sc5IFD8ABp2RlZmF1bHTAwMCYoXILCsDAkQTAwpyhaQETBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmka2V5c5IIDsACp2RlZmF1bHTAwMCYoXILBMDAkQfAwpyhaQEVBwqQwMICwsDAl6FvAQALEJDAmaFkAAQMwJQNDg8MwMKZoWyqZ2V0QWxsS2V5c5IMEsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldEFsbEtleXMuanOYoXIJCsANkQvAwpihchQOwA6RAcDCmKFyCQTAD5EHwMKYoXICCsDAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAKwMCRC8DC
====catalogjs annotation end====*/