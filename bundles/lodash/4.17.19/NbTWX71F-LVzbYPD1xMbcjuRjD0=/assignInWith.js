import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keysIn } from "./keysIn.js";
var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});
export { assignInWith as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMGwsCVwqsuL2tleXNJbi5qcwnCwIGnZGVmYXVsdJShbKxhc3NpZ25JbldpdGgTwNwAFZehbwAAA8CRDMCZoWQJAALAkQLAwpihaapjb3B5T2JqZWN0kgIQwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprmNyZWF0ZUFzc2lnbmVykgUPwAGnZGVmYXVsdMDAmKFyCw7AwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFppmtleXNJbpIIEcACp2RlZmF1bHTAwJihcgsGwMCRB8DCnKFpARYHCpDAwgLCwMCXoW8BAAsSkMCYoWcAAQzAkMDCmaFkBAANwJMNCw7AwpihbKxhc3NpZ25JbldpdGiSDRTAwMAL2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXNzaWduSW5XaXRoLmpzmKFyAAzADpEMwMKYoWcDIQ/AlA8QEQzAwpihcgAOwBCRBMDCmKFyNQrAEZEBwMKYoXIJBsDAkQfAwpihZwEDE8CQwMKYoWcJCxTAkRTAwpihcgAMwMCRDMDC
====catalogjs annotation end====*/