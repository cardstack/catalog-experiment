import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function startsWith(string, target, position) {
  string = toString0(string);
  position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
  target = baseToString(target);
  return string.slice(position, position + target.length) == target;
}
export { startsWith as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKsLi9kaXN0LzIyLmpzB8LAlcKuLi90b0ludGVnZXIuanMLwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0laFsqnN0YXJ0c1dpdGgZwMDcABuXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaliYXNlQ2xhbXCSAhXAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmsYmFzZVRvU3RyaW5nkgYXwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFpqXRvSW50ZWdlcpIKFsACp2RlZmF1bHTAwMCYoXILCcDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgQwMCQwMKZoWQJAA4QkQ7Awpmhaal0b1N0cmluZzCSDhTAA6dkZWZhdWx0wMDAmKFyCwnAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcID8DAkMDCl6FvAQASGJDAmaFkAFATwJUUFRYXE8DCmaFsqnN0YXJ0c1dpdGiSExrAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3N0YXJ0c1dpdGguanOYoXIJCsAUkRLAwpihcigJwBWRDcDCmKFyLgnAFpEBwMKYoXIBCcAXkQnAwpihcioMwMCRBcDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAArAwJESwMI=
====catalogjs annotation end====*/