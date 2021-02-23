import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keys } from "./keys.js";
var assignWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keys(source), object, customizer);
});
export { assignWith as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMHwsCVwqkuL2tleXMuanMLwsCBp2RlZmF1bHSVoWyqYXNzaWduV2l0aBbAwNwAGJehbwAAA8CRD8CZoWQJAAIEkQLAwpmhaapjb3B5T2JqZWN0kgITwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFprmNyZWF0ZUFzc2lnbmVykgYSwAGnZGVmYXVsdMDAwJihcgsOwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFppGtleXOSChTAAqdkZWZhdWx0wMDAmKFyCwTAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIC8DAkMDCl6FvAQAOFZDAmKFnAAEPwJDAwpmhZAQAEMCTEA4RwMKZoWyqYXNzaWduV2l0aJIQF8DAwA6Q2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXNzaWduV2l0aC5qc5ihcgAKwBGRD8DCmKFnAyESwJMSExTAwpihcgAOwBORBcDCmKFyNQrAFJEBwMKYoXIJBMDAkQnAwpihZwEDFsCQwMKYoWcJCxfAkRfAwpihcgAKwMCRD8DC
====catalogjs annotation end====*/