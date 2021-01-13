import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}
export { flatMap as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwbCwIGnZGVmYXVsdJShbKdmbGF0TWFwDcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpq2Jhc2VGbGF0dGVukgIKwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpo21hcJIFC8ABp2RlZmF1bHTAwJihcgsDwMCRBMDCnKFpARMEB5DAwgHCwMCXoW8BAAgMkMCZoWQAHQnAkwoLCcDCmKFsp2ZsYXRNYXCSCQ7AwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmxhdE1hcC5qc5ihcgkHwAqRCMDCmKFyIgvAC5EBwMKYoXIBA8DAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAHwMCRCMDC
====catalogjs annotation end====*/