import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keys } from "./keys.js";
var assignWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keys(source), object, customizer);
});
export { assignWith as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMGwsCVwqkuL2tleXMuanMJwsCBp2RlZmF1bHSVoWyqYXNzaWduV2l0aBPAwNwAFZehbwAAA8CRDMCZoWQJAALAkQLAwpmhaapjb3B5T2JqZWN0kgIQwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaa5jcmVhdGVBc3NpZ25lcpIFD8ABp2RlZmF1bHTAwMCYoXILDsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmka2V5c5IIEcACp2RlZmF1bHTAwMCYoXILBMDAkQfAwpyhaQEUBwqQwMICwsDAl6FvAQALEpDAmKFnAAEMwJDAwpmhZAQADcCTDQsOwMKZoWyqYXNzaWduV2l0aJINFMDAwAuQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXNzaWduV2l0aC5qc5ihcgAKwA6RDMDCmKFnAyEPwJMPEBHAwpihcgAOwBCRBMDCmKFyNQrAEZEBwMKYoXIJBMDAkQfAwpihZwEDE8CQwMKYoWcJCxTAkRTAwpihcgAKwMCRDMDC
====catalogjs annotation end====*/