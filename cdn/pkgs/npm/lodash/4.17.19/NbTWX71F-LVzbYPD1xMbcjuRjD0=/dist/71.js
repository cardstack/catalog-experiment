import { default as baseGetAllKeys } from "./99.js";
import { default as getSymbols } from "./149.js";
import { default as keys } from "../keys.js";
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}
export { getAllKeys as default };
/*====catalogjs annotation start====
k5OVwqcuLzk5LmpzA8LAlcKoLi8xNDkuanMHwsCVwqouLi9rZXlzLmpzC8LAgadkZWZhdWx0laFsqmdldEFsbEtleXMUwMDcABaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaa5iYXNlR2V0QWxsS2V5c5ICEMAAp2RlZmF1bHTAwMCYoXILDsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaapnZXRTeW1ib2xzkgYSwAGnZGVmYXVsdMDAwJihcgsKwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCArAwJDAwpmhZAkACgyRCsDCmaFppGtleXOSChHAAqdkZWZhdWx0wMDAmKFyCwTAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIDMDAkMDCl6FvAQAOE5DAmaFkAAQPwJQQERIPwMKZoWyqZ2V0QWxsS2V5c5IPFcDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldEFsbEtleXMuanOYoXIJCsAQkQ7AwpihchQOwBGRAcDCmKFyCQTAEpEJwMKYoXICCsDAkQXAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAKwMCRDsDC
====catalogjs annotation end====*/