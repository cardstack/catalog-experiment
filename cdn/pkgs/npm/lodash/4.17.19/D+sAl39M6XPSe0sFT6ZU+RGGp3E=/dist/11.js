import { default as baseGet } from "./14.js";
import { default as baseSlice } from "./142.js";
function parent0(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}
export { parent0 as default };
/*====catalogjs annotation start====
k5KVwqcuLzE0LmpzA8LAlcKoLi8xNDIuanMHwsCBp2RlZmF1bHSVoWyncGFyZW50MA/AwNwAEZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpp2Jhc2VHZXSSAgzAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmpYmFzZVNsaWNlkgYNwAGnZGVmYXVsdMDAwJihcgsJwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCArAwJDAwpehbwEACg6QwJmhZAARC8CTDA0LwMKZoWyncGFyZW50MJILEMDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3BhcmVudC5qc5ihcgkHwAyRCsDCmKFyNQfADZEBwMKYoXIJCcDAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAHwMCRCsDC
====catalogjs annotation end====*/