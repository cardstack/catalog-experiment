import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
function endsWith(string, target, position) {
  string = toString(string);
  target = baseToString(target);
  var length = string.length;
  position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
  var end = position;
  position -= target.length;
  return position >= 0 && string.slice(position, end) == target;
}
export { endsWith as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKsLi9kaXN0LzIyLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFsqGVuZHNXaXRoFcDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpihaaliYXNlQ2xhbXCSAhLAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsYmFzZVRvU3RyaW5nkgURwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXRvSW50ZWdlcpIIE8ACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpihaah0b1N0cmluZ5ILEMADp2RlZmF1bHTAwJihcgsIwMCRCsDCnKFpARgKDZDAwgPCwMCXoW8BAA4UkMCZoWQAzI0PwJUQERITD8DCmKFsqGVuZHNXaXRokg8WwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2VuZHNXaXRoLmpzmKFyCQjAEJEOwMKYoXIoCMARkQrAwpihchUMwBKRBMDCmKFyVwnAE5EBwMKYoXIBCcDAkQfAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAIwMCRDsDC
====catalogjs annotation end====*/